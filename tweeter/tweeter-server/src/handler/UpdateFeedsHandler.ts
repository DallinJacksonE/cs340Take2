import { SQSEvent } from "aws-lambda";
import { DynamoDAOFactory } from "../db/DynamoDAOFactory";
import { Status, User } from "tweeter-shared";

export const handler = async (event: SQSEvent): Promise<void> => {
	const daoFactory = new DynamoDAOFactory();
	const statusDAO = daoFactory.getStatusDAO();

	for (const record of event.Records) {
		const messageBody = JSON.parse(record.body);
		const followerAliases = messageBody.followerAliases || [];
		const statusData = messageBody.status;

		if (!statusData || (!statusData.user && !statusData._user)) {
			console.warn("Poison pill caught. Discarding malformed message.");
			continue;
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

		// 2. Write to DynamoDB (NO TRY/CATCH)
		// If DynamoDB is completely overwhelmed, this WILL throw an exception.
		// The Lambda will fail, and SQS will safely hold the message to retry later!
		if (followerAliases.length > 0) {
			await statusDAO.putFeedBatch(followerAliases, status);
		}
	}
};
