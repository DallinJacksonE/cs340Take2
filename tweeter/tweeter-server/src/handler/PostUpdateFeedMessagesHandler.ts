import { SQSEvent } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DynamoDAOFactory } from "../db/DynamoDAOFactory";

export const handler = async (event: SQSEvent): Promise<void> => {
  const sqsClient = new SQSClient();
  const queueUrl = process.env.UPDATE_FEED_QUEUE_URL;
  const daoFactory = new DynamoDAOFactory();
  const followDAO = daoFactory.getFollowDAO();

  if (!queueUrl) {
    throw new Error("UPDATE_FEED_QUEUE_URL is not defined");
  }

  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);
    const status = messageBody.status;
    const authorAlias = status.user.alias;

    let hasMorePages = true;
    let lastFollowerAlias: string | null = null;
    const pageSize = 250; // Fetch a good chunk of followers at a time

    while (hasMorePages) {
      // 1. Get a page of followers
      const [followers, hasMore] = await followDAO.getFollowers(
        authorAlias,
        pageSize,
        lastFollowerAlias,
      );

      hasMorePages = hasMore;
      if (followers.length > 0) {
        lastFollowerAlias = followers[followers.length - 1].alias;

        // Extract just the aliases to keep the SQS message size small
        const followerAliases = followers.map((f) => f.alias);

        // 2. Send this batch to the UpdateFeedQueue
        const updateFeedMessage = {
          status: status,
          followerAliases: followerAliases,
        };

        const params = {
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(updateFeedMessage),
        };

        await sqsClient.send(new SendMessageCommand(params));
      }
    }
  }
};
