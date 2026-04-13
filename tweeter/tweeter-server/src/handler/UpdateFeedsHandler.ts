import { SQSEvent } from "aws-lambda";
import { DynamoDAOFactory } from "../db/DynamoDAOFactory";
import { Status, User } from "tweeter-shared";

export const handler = async (event: SQSEvent): Promise<void> => {
  const daoFactory = new DynamoDAOFactory();
  const statusDAO = daoFactory.getStatusDAO();

  // Process all 10 SQS records concurrently!
  const promises = event.Records.map(async (record) => {
    const messageBody = JSON.parse(record.body);
    const followerAliases = messageBody.followerAliases || [];
    const statusData = messageBody.status;

    if (!statusData || (!statusData.user && !statusData._user)) {
      console.warn("Poison pill caught. Discarding malformed message.");
      return; // Use 'return' instead of 'continue' inside a map
    }

    const userData = statusData.user || statusData._user;

    const post = statusData.post || statusData._post;
    const firstName = userData.firstName || userData._firstName;
    const lastName = userData.lastName || userData._lastName;
    const alias = userData.alias || userData._alias;
    const imageUrl = userData.imageUrl || userData._imageUrl;
    const timestamp = statusData.timestamp || statusData._timestamp;

    const status = new Status(
      post,
      new User(firstName, lastName, alias, imageUrl),
      timestamp,
    );

    if (followerAliases.length > 0) {
      await statusDAO.putFeedBatch(followerAliases, status);
    }
  });

  // Wait for all concurrent DynamoDB writes to finish
  await Promise.all(promises);
};
