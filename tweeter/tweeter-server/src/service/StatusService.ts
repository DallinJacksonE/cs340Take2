import { Status } from "tweeter-shared";
import { DAOFactory } from "../db/DAOs/DAOInterfaces/DAOFactory";
import { DynamoDAOFactory } from "../db/DynamoDAOFactory";
import { FollowDAO } from "../db/DAOs/DAOInterfaces/FollowDAO";
import { StatusDAO } from "../db/DAOs/DAOInterfaces/StatusDAO";
import { BaseService } from "./BaseService";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class StatusService extends BaseService {
  private _statusDAO: StatusDAO;
  private _followDAO: FollowDAO;

  constructor(daoFactory: DAOFactory = new DynamoDAOFactory()) {
    super(daoFactory);
    this._statusDAO = daoFactory.getStatusDAO();
    this._followDAO = daoFactory.getFollowDAO();
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    await this.getAliasFromToken(token);
    return this._statusDAO.getStory(userAlias, pageSize, lastItem);
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    await this.getAliasFromToken(token);
    return this._statusDAO.getFeed(userAlias, pageSize, lastItem);
  }

  public async postStatus(token: string, newStatus: Status): Promise<void> {
    const alias = await this.getAliasFromToken(token);
    if (alias !== newStatus.user.alias) {
      throw new Error(
        "[bad-request] User alias in status does not match user alias from token.",
      );
    }

    // 1. Post the status to the user's own story (synchronous)
    await this._statusDAO.postStatus(newStatus);

    // 2. Send the status to the SQS queue for asynchronous feed updates
    const sqsClient = new SQSClient();
    const queueUrl = process.env.POST_STATUS_QUEUE_URL;

    if (!queueUrl) {
      throw new Error("POST_STATUS_QUEUE_URL is not defined");
    }

    const messageBody = JSON.stringify({
      status: newStatus,
    });

    const params = {
      QueueUrl: queueUrl,
      MessageBody: messageBody,
    };

    try {
      await sqsClient.send(new SendMessageCommand(params));
    } catch (error) {
      throw new Error(
        "[internal-server-error] Failed to send message to queue: " + error,
      );
    }
  }
}
