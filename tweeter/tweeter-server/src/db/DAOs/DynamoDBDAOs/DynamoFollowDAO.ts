import { User } from "tweeter-shared";
import { FollowDAO } from "../DAOInterfaces/FollowDAO";
import { DynamoDAO } from "../DynamoDAO";
import {
  QueryCommand,
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { UserDAO } from "../DAOInterfaces/UserDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";

export class DynamoFollowDAO extends DynamoDAO implements FollowDAO {
  private readonly FOLLOWS_INDEX_NAME = "follows_inverted_index";

  private _userDAO: UserDAO;

  constructor(userDAO: UserDAO = new DynamoUserDAO()) {
    super("follows");
    this._userDAO = userDAO;
  }

  public async getFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null,
  ): Promise<[User[], boolean]> {
    const params = {
      TableName: this.TABLE_NAME,
      KeyConditionExpression: "followee_alias = :fa",
      ExpressionAttributeValues: {
        ":fa": followeeAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastFollowerAlias
        ? {
            followee_alias: followeeAlias,
            follower_alias: lastFollowerAlias,
          }
        : undefined,
    };

    const output = await this._documentClient.send(new QueryCommand(params));
    const followers: User[] = [];
    output.Items?.forEach((item) => {
      item = item as {
        follower_name: string;
        follower_alias: string;
        follower_imageUrl: string;
      };
      followers.push(
        new User(
          item.follower_name.split(" ")[0],
          item.follower_name.split(" ").slice(1).join(" "),
          item.follower_alias,
          item.follower_imageUrl,
        ),
      );
    });

    const hasMorePages = output.LastEvaluatedKey !== undefined;
    return [followers, hasMorePages];
  }
  public async getFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null,
  ): Promise<[User[], boolean]> {
    const params = {
      TableName: this.TABLE_NAME,
      IndexName: this.FOLLOWS_INDEX_NAME,
      KeyConditionExpression: "follower_alias = :fa",
      ExpressionAttributeValues: {
        ":fa": followerAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastFolloweeAlias
        ? {
            follower_alias: followerAlias,
            followee_alias: lastFolloweeAlias,
          }
        : undefined,
    };

    const output = await this._documentClient.send(new QueryCommand(params));
    const followees: User[] = [];
    output.Items?.forEach((item) => {
      item = item as {
        followee_name: string;
        followee_alias: string;
        followee_imageUrl: string;
      };
      followees.push(
        new User(
          item.followee_name.split(" ")[0],
          item.followee_name.split(" ").slice(1).join(" "),
          item.followee_alias,
          item.followee_imageUrl,
        ),
      );
    });

    const hasMorePages = output.LastEvaluatedKey !== undefined;
    return [followees, hasMorePages];
  }
  public async isFollower(
    followerAlias: string,
    followeeAlias: string,
  ): Promise<boolean> {
    const params = {
      TableName: this.TABLE_NAME,
      Key: {
        followee_alias: followeeAlias,
        follower_alias: followerAlias,
      },
    };
    const output = await this._documentClient.send(new GetCommand(params));
    return output.Item !== undefined;
  }
  public async follow(
    followerAlias: string,
    followeeAlias: string,
  ): Promise<void> {
    const followerUser = await this._userDAO.getUser(followerAlias);
    const followeeUser = await this._userDAO.getUser(followeeAlias);

    if (!followerUser || !followeeUser) {
      throw new Error("User not found for follow operation.");
    }

    const item = {
      followee_alias: followeeAlias,
      follower_alias: followerAlias,
      followee_name: `${followeeUser.firstName} ${followeeUser.lastName}`,
      follower_name: `${followerUser.firstName} ${followerUser.lastName}`,
      followee_imageUrl: followeeUser.imageUrl,
      follower_imageUrl: followerUser.imageUrl,
    };

    const params = {
      TableName: this.TABLE_NAME,
      Item: item,
    };
    await this._documentClient.send(new PutCommand(params));
  }
  public async unfollow(
    followerAlias: string,
    followeeAlias: string,
  ): Promise<void> {
    const params = {
      TableName: this.TABLE_NAME,
      Key: {
        followee_alias: followeeAlias,
        follower_alias: followerAlias,
      },
    };
    await this._documentClient.send(new DeleteCommand(params));
  }
  public async getAllFollowerAliases(followeeAlias: string): Promise<string[]> {
    const followerAliases: string[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;

    do {
      const params = {
        TableName: this.TABLE_NAME,
        KeyConditionExpression: "followee_alias = :fa",
        ExpressionAttributeValues: {
          ":fa": followeeAlias,
        },
        ProjectionExpression: "follower_alias",
        ExclusiveStartKey: lastEvaluatedKey,
      };

      const output: QueryCommandOutput = await this._documentClient.send(
        new QueryCommand(params),
      );
      output.Items?.forEach((item) => {
        followerAliases.push(item.follower_alias as string);
      });
      lastEvaluatedKey = output.LastEvaluatedKey;
    } while (lastEvaluatedKey !== undefined);

    return followerAliases;
  }
}
