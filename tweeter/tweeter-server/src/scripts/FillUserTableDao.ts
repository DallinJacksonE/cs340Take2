import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import * as bcrypt from "bcryptjs";
import { User } from "tweeter-shared";

export class FillUserTableDao {
  private readonly tableName = "users";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createUsers(userList: User[], password: string) {
    if (userList.length == 0) return;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const params = {
      RequestItems: {
        [this.tableName]: this.createPutUserRequestItems(
          userList,
          hashedPassword,
          salt,
        ),
      },
    };

    try {
      let resp = await this.client.send(new BatchWriteCommand(params));
      await this.putUnprocessedItems(resp, params);
    } catch (err) {
      throw new Error(`Error batch writing users: \n${err}`);
    }
  }

  private createPutUserRequestItems(
    userList: User[],
    hashedPassword: string,
    salt: string,
  ) {
    return userList.map((user) => ({
      PutRequest: {
        Item: {
          alias: user.alias,
          firstName: user.firstName,
          lastName: user.lastName,
          hashedPassword: hashedPassword,
          salt: salt,
          imageUrl: user.imageUrl,
          followersCount: 0,
          followeesCount: 1,
        },
      },
    }));
  }

  private async putUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput,
  ) {
    let delay = 10;
    while (
      resp.UnprocessedItems &&
      Object.keys(resp.UnprocessedItems).length > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      if (delay < 1000) delay += 100;

      params.RequestItems = resp.UnprocessedItems;
      resp = await this.client.send(new BatchWriteCommand(params));
    }
  }

  async increaseFollowersCount(alias: string, count: number) {
    const params = {
      TableName: this.tableName,
      Key: { alias: alias },
      ExpressionAttributeValues: { ":inc": count },
      UpdateExpression: "SET followersCount = followersCount + :inc",
    };
    await this.client.send(new UpdateCommand(params));
  }
}
