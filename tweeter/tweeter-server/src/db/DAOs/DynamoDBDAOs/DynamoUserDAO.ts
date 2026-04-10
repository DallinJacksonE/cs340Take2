import { User } from "tweeter-shared";
import { UserDAO } from "../DAOInterfaces/UserDAO";
import { DynamoDAO } from "../DynamoDAO";
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoUserDAO extends DynamoDAO implements UserDAO {
	constructor() {
		super("users");
	}

	public async getUser(alias: string): Promise<User | null> {
		const params = {
			TableName: this.TABLE_NAME,
			Key: { alias: alias },
		};
		const output = await this._documentClient.send(new GetCommand(params));
		if (output.Item) {
			return new User(
				output.Item.firstName,
				output.Item.lastName,
				output.Item.alias,
				output.Item.imageUrl,
			);
		} else {
			return null;
		}
	}
	public async putUser(
		firstName: string,
		lastName: string,
		alias: string,
		hashedPassword: string,
		salt: string,
		imageUrl: string,
	): Promise<void> {
		const item = {
			firstName: firstName,
			lastName: lastName,
			alias: alias,
			hashedPassword: hashedPassword,
			salt: salt,
			imageUrl: imageUrl,
			followersCount: 0,
			followeesCount: 0,
		};

		const params = {
			TableName: this.TABLE_NAME,
			Item: item,
			// Tell DynamoDB to ONLY write this if the alias does not already exist
			ConditionExpression: "attribute_not_exists(alias)",
		};

		await this._documentClient.send(new PutCommand(params));
	}
	public async getUserWithPassword(
		alias: string,
	): Promise<{ user: User; hashedPassword: string; salt: string } | null> {
		const params = {
			TableName: this.TABLE_NAME,
			Key: { alias: alias },
		};
		const output = await this._documentClient.send(new GetCommand(params));
		if (output.Item) {
			const user = new User(
				output.Item.firstName,
				output.Item.lastName,
				output.Item.alias,
				output.Item.imageUrl,
			);
			return {
				user: user,
				hashedPassword: output.Item.hashedPassword,
				salt: output.Item.salt,
			};
		} else {
			return null;
		}
	}
	public async getFollowersCount(alias: string): Promise<number> {
		const params = {
			TableName: this.TABLE_NAME,
			Key: { alias: alias },
			ProjectionExpression: "followersCount",
		};
		const output = await this._documentClient.send(new GetCommand(params));
		return output.Item?.followersCount ?? 0;
	}
	public async getFolloweesCount(alias: string): Promise<number> {
		const params = {
			TableName: this.TABLE_NAME,
			Key: { alias: alias },
			ProjectionExpression: "followeesCount",
		};
		const output = await this._documentClient.send(new GetCommand(params));
		return output.Item?.followeesCount ?? 0;
	}
	public async updateFollowersCount(
		alias: string,
		value: number,
	): Promise<void> {
		const params = {
			TableName: this.TABLE_NAME,
			Key: { alias: alias },
			UpdateExpression: "SET followersCount = followersCount + :val",
			ExpressionAttributeValues: {
				":val": value,
			},
		};
		await this._documentClient.send(new UpdateCommand(params));
	}
	public async updateFolloweesCount(
		alias: string,
		value: number,
	): Promise<void> {
		const params = {
			TableName: this.TABLE_NAME,
			Key: { alias: alias },
			UpdateExpression: "SET followeesCount = followeesCount + :val",
			ExpressionAttributeValues: {
				":val": value,
			},
		};
		await this._documentClient.send(new UpdateCommand(params));
	}
}
