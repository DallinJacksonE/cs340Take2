import { Status, User } from "tweeter-shared";
import { StatusDAO } from "../DAOInterfaces/StatusDAO";
import { DynamoDAO } from "../DynamoDAO";
import {
  BatchWriteCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

export class DynamoStatusDAO extends DynamoDAO implements StatusDAO {
  private readonly FEED_TABLE_NAME = "feed";

  constructor() {
    super("statuses");
  }

  public async getStory(
    userAlias: string,
    pageSize: number,
    lastStatus: Status | null,
  ): Promise<[Status[], boolean]> {
    const params = {
      TableName: this.TABLE_NAME,
      KeyConditionExpression: "user_alias = :ua",
      ExpressionAttributeValues: {
        ":ua": userAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastStatus
        ? {
            user_alias: userAlias,
            timestamp: lastStatus.timestamp,
          }
        : undefined,
      ScanIndexForward: false, // For reverse chronological order
    };

    const output = await this._documentClient.send(new QueryCommand(params));
    const story: Status[] = [];
    output.Items?.forEach((item) => {
      item = item as {
        user_firstName: string;
        user_lastName: string;
        user_alias: string;
        user_imageUrl: string;
        post: string;
        timestamp: number;
      };
      const user = new User(
        item.user_firstName,
        item.user_lastName,
        item.user_alias,
        item.user_imageUrl,
      );
      story.push(new Status(item.post, user, item.timestamp));
    });

    const hasMorePages = output.LastEvaluatedKey !== undefined;
    return [story, hasMorePages];
  }
  public async getFeed(
    userAlias: string,
    pageSize: number,
    lastStatus: Status | null,
  ): Promise<[Status[], boolean]> {
    const params = {
      TableName: this.FEED_TABLE_NAME,
      KeyConditionExpression: "user_alias = :ua",
      ExpressionAttributeValues: {
        ":ua": userAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastStatus
        ? {
            user_alias: userAlias,
            timestamp: lastStatus.timestamp,
          }
        : undefined,
      ScanIndexForward: false, // For reverse chronological order
    };

    const output = await this._documentClient.send(new QueryCommand(params));
    const feed: Status[] = [];
    output.Items?.forEach((item) => {
      item = item as {
        author_firstName: string;
        author_lastName: string;
        author_alias: string;
        author_imageUrl: string;
        post: string;
        timestamp: number;
      };
      const author = new User(
        item.author_firstName,
        item.author_lastName,
        item.author_alias,
        item.author_imageUrl,
      );
      feed.push(new Status(item.post, author, item.timestamp));
    });

    const hasMorePages = output.LastEvaluatedKey !== undefined;
    return [feed, hasMorePages];
  }
  public async postStatus(status: Status): Promise<void> {
    const item = {
      user_alias: status.user.alias,
      timestamp: status.timestamp,
      post: status.post,
      user_firstName: status.user.firstName,
      user_lastName: status.user.lastName,
      user_imageUrl: status.user.imageUrl,
    };

    const params = {
      TableName: this.TABLE_NAME,
      Item: item,
    };
    await this._documentClient.send(new PutCommand(params));
  }
  public async putFeedBatch(
    userAliases: string[],
    status: Status,
  ): Promise<void> {
    if (userAliases.length === 0) {
      return;
    }

    const batchSize = 25;
    for (let i = 0; i < userAliases.length; i += batchSize) {
      const batch = userAliases.slice(i, i + batchSize);
      const putRequests = batch.map((alias) => ({
        PutRequest: {
          Item: {
            user_alias: alias,
            timestamp: status.timestamp,
            post: status.post,
            author_alias: status.user.alias,
            author_firstName: status.user.firstName,
            author_lastName: status.user.lastName,
            author_imageUrl: status.user.imageUrl,
          },
        },
      }));

      const params = {
        RequestItems: {
          [this.FEED_TABLE_NAME]: putRequests,
        },
      };

      const command = new BatchWriteCommand(params);
      await this._documentClient.send(command);
    }
  }
}
