import { User } from "tweeter-shared";
import { DAOFactory } from "../db/DAOs/DAOInterfaces/DAOFactory";
import { FollowDAO } from "../db/DAOs/DAOInterfaces/FollowDAO";
import { DynamoDAOFactory } from "../db/DynamoDAOFactory";
import { BaseService } from "./BaseService";

export class FollowService extends BaseService {
  private _followDAO: FollowDAO;

  constructor(daoFactory: DAOFactory = new DynamoDAOFactory()) {
    super(daoFactory);
    this._followDAO = daoFactory.getFollowDAO();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null,
  ): Promise<[User[], boolean]> {
    await this.getAliasFromToken(token);
    return this._followDAO.getFollowers(userAlias, pageSize, lastFollowerAlias);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null,
  ): Promise<[User[], boolean]> {
    await this.getAliasFromToken(token);
    return this._followDAO.getFollowees(userAlias, pageSize, lastFolloweeAlias);
  }
}
