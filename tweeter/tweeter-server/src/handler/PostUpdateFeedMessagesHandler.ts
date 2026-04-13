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

    // 1. Massive page size to ensure we finish in under 16 loops
    const pageSize = 1000;

    const [followers, hasMore] = await followDAO.getFollowers(
      authorAlias,
      pageSize,
      currentLastFollowerAlias,
    );

    if (followers.length > 0) {
      const followerAliases = followers.map((f) => f.alias);
      const chunkSize = 25;
      let batchIndex = 0;
      let currentDelay = 0;

      for (let i = 0; i < followerAliases.length; i += chunkSize) {
        const chunk = followerAliases.slice(i, i + chunkSize);

        // 2. STAGGER THE LOAD
        // We write 4 batches of 25 (100 feeds) per second.
        // Every 4th batch, we increase the SQS delivery delay by 1 second.
        currentDelay = Math.floor(batchIndex / 4);

        const updateFeedMessage = {
          status: statusData,
          followerAliases: chunk,
        };

        await sqsClient.send(
          new SendMessageCommand({
            QueueUrl: updateFeedQueueUrl,
            MessageBody: JSON.stringify(updateFeedMessage),
            DelaySeconds: currentDelay, // The messages wake up sequentially
          }),
        );

        batchIndex++;
      }

      // 3. Delay the next continuation loop until the current staggered chunks are finished
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
            DelaySeconds: currentDelay + 1,
          }),
        );
      }
    }
  }
};
