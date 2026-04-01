import { AuthToken } from "tweeter-shared";
import { AuthTokenDAO } from "../DAOInterfaces/AuthTokenDAO";
import { DynamoDAO } from "../DynamoDAO";
import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoAuthTokenDAO extends DynamoDAO implements AuthTokenDAO {
  private readonly TWO_HOURS_IN_SECONDS = 2 * 60 * 60;

  constructor() {
    super("authtokens");
  }

  public async putAuthToken(token: AuthToken, alias: string): Promise<void> {
    const item = {
      token: token.token,
      timestamp: token.timestamp,
      alias: alias,
      ttl: Math.floor(Date.now() / 1000) + this.TWO_HOURS_IN_SECONDS,
    };

    const params = {
      TableName: this.TABLE_NAME,
      Item: item,
    };
    await this._documentClient.send(new PutCommand(params));
  }
  public async getAuthToken(
    token: string,
  ): Promise<[AuthToken, string] | null> {
    const params = {
      TableName: this.TABLE_NAME,
      Key: { token: token },
    };
    const output = await this._documentClient.send(new GetCommand(params));
    if (output.Item) {
      return [
        new AuthToken(output.Item.token, output.Item.timestamp),
        output.Item.alias,
      ];
    } else {
      return null;
    }
  }
  public async deleteAuthToken(token: string): Promise<void> {
    const params = {
      TableName: this.TABLE_NAME,
      Key: { token: token },
    };
    await this._documentClient.send(new DeleteCommand(params));
  }
}
