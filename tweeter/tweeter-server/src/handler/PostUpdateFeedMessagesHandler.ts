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
		const statusData = messageBody.status;

		// Bulletproof extraction handling serialized private fields
		const userData = statusData.user || statusData._user;
		const authorAlias = userData.alias || userData._alias;

		let hasMorePages = true;
		let lastFollowerAlias: string | null = null;
		const pageSize = 250;

		while (hasMorePages) {
			const [followers, hasMore] = await followDAO.getFollowers(
				authorAlias,
				pageSize,
				lastFollowerAlias,
			);

			hasMorePages = hasMore;
			if (followers.length > 0) {
				lastFollowerAlias = followers[followers.length - 1].alias;
				const followerAliases = followers.map((f) => f.alias);

				const updateFeedMessage = {
					status: statusData,
					followerAliases: followerAliases,
				};

				const params = {
					QueueUrl: queueUrl,
					MessageBody: JSON.stringify(updateFeedMessage),
				};

				await sqsClient.send(new SendMessageCommand(params));
				await new Promise((resolve) => setTimeout(resolve, 500));
			}
		}
	}
};
