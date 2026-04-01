import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export abstract class DynamoDAO {
  protected readonly TABLE_NAME: string;
  protected readonly REGION = "us-east-1";

  private readonly _client: DynamoDBClient;
  protected readonly _documentClient: DynamoDBDocumentClient;

  constructor(tableName: string) {
    this.TABLE_NAME = tableName;
    this._client = new DynamoDBClient({ region: this.REGION });
    this._documentClient = DynamoDBDocumentClient.from(this._client);
  }
}
