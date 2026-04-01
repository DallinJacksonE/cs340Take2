import { Status } from "tweeter-shared";
import { DAOFactory } from "../db/DAOs/DAOInterfaces/DAOFactory";
import { DynamoDAOFactory } from "../db/DynamoDAOFactory";
import { FollowDAO } from "../db/DAOs/DAOInterfaces/FollowDAO";
import { StatusDAO } from "../db/DAOs/DAOInterfaces/StatusDAO";
import { BaseService } from "./BaseService";

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
    await this._statusDAO.postStatus(newStatus);
    const followers = await this._followDAO.getAllFollowerAliases(alias);
    await this._statusDAO.putFeedBatch(followers, newStatus);
  }
}
