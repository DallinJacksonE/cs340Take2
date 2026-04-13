import { SQSEvent } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DynamoDAOFactory } from "../db/DynamoDAOFactory";

export const handler = async (event: SQSEvent): Promise<void> => {
  const sqsClient = new SQSClient();
  const updateFeedQueueUrl = process.env.UPDATE_FEED_QUEUE_URL;
  const postStatusQueueUrl = process.env.POST_STATUS_QUEUE_URL;
  const daoFactory = new DynamoDAOFactory();
  const followDAO = daoFactory.getFollowDAO();

  if (!updateFeedQueueUrl || !postStatusQueueUrl) {
    throw new Error("Queue URLs are not defined in environment variables");
  }

  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);
    const statusData = messageBody.status;
    const currentLastFollowerAlias = messageBody.lastFollowerAlias || null;

    const userData = statusData.user || statusData._user;
    const authorAlias = userData.alias || userData._alias;

    const pageSize = 1000;

    const [followers, hasMore] = await followDAO.getFollowers(
      authorAlias,
      pageSize,
      currentLastFollowerAlias,
    );

    if (followers.length > 0) {
      const followerAliases = followers.map((f) => f.alias);

      // 1. Bundle exactly 100 feeds (1 second of database capacity)
      const chunkSize = 100;
      let currentDelay = 0;

      for (let i = 0; i < followerAliases.length; i += chunkSize) {
        const chunk = followerAliases.slice(i, i + chunkSize);

        const updateFeedMessage = {
          status: statusData,
          followerAliases: chunk,
        };

        await sqsClient.send(
          new SendMessageCommand({
            QueueUrl: updateFeedQueueUrl,
            MessageBody: JSON.stringify(updateFeedMessage),
            DelaySeconds: currentDelay,
          }),
        );

        // 2. Increment the delay by exactly 1 second for the next 100 items
        currentDelay++;
      }

      // 3. The continuation message delays exactly until the current 1000 are done
      if (hasMore) {
        const nextLastFollowerAlias = followers[followers.length - 1].alias;

        const continuationMessage = {
          status: statusData,
          lastFollowerAlias: nextLastFollowerAlias,
        };

        await sqsClient.send(
          new SendMessageCommand({
            QueueUrl: postStatusQueueUrl,
            MessageBody: JSON.stringify(continuationMessage),
            DelaySeconds: currentDelay,
          }),
        );
      }
    }
  }
};
