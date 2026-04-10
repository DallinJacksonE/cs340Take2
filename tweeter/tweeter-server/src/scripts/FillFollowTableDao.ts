import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { User } from "tweeter-shared";

export class FillFollowTableDao {
  private readonly tableName = "follows";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createFollows(followeeAlias: string, followers: User[]) {
    if (followers.length == 0) return;

    const params = {
      RequestItems: {
        [this.tableName]: this.createPutFollowRequestItems(
          followeeAlias,
          followers,
        ),
      },
    };

    try {
      let response = await this.client.send(new BatchWriteCommand(params));
      await this.putUnprocessedItems(response, params);
    } catch (err) {
      throw new Error(`Error batch writing follows: \n${err}`);
    }
  }

  private createPutFollowRequestItems(
    followeeAlias: string,
    followers: User[],
  ) {
    return followers.map((follower) => ({
      PutRequest: {
        Item: {
          followee_alias: followeeAlias,
          follower_alias: follower.alias,
          followee_name: "Dallin Jackson", // Or the actual name of your target
          follower_name: `${follower.firstName} ${follower.lastName}`,
          followee_imageUrl: "https://images.coolpfp.com/funny-pfp-30.png",
          follower_imageUrl: follower.imageUrl,
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
}
