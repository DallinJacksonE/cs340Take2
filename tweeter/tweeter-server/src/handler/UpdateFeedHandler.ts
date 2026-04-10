import { SQSEvent } from "aws-lambda";
import { DynamoDAOFactory } from "../db/DynamoDAOFactory";
import { Status, User } from "tweeter-shared";

export const handler = async (event: SQSEvent): Promise<void> => {
  const daoFactory = new DynamoDAOFactory();
  const statusDAO = daoFactory.getStatusDAO();

  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);
    const followerAliases = messageBody.followerAliases;

    // Reconstruct the Status object to ensure it has its methods/types
    const statusData = messageBody.status;
    const status = new Status(
      statusData.post,
      new User(
        statusData.user.firstName,
        statusData.user.lastName,
        statusData.user.alias,
        statusData.user.imageUrl,
      ),
      statusData.timestamp,
    );

    // Write the batch of feeds to DynamoDB
    if (followerAliases && followerAliases.length > 0) {
      await statusDAO.putFeedBatch(followerAliases, status);
    }
  }
};
