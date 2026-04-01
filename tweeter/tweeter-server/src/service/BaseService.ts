import { AuthTokenDAO } from "../db/DAOs/DAOInterfaces/AuthTokenDAO";
import { DAOFactory } from "../db/DAOs/DAOInterfaces/DAOFactory";

export abstract class BaseService {
  protected readonly _authTokenDAO: AuthTokenDAO;

  constructor(daoFactory: DAOFactory) {
    this._authTokenDAO = daoFactory.getAuthTokenDAO();
  }

  protected async getAliasFromToken(token: string): Promise<string> {
    const authTokenAndAlias = await this._authTokenDAO.getAuthToken(token);
    if (!authTokenAndAlias) {
      throw new Error("[unauthorized] Invalid auth token");
    }

    const [authToken, alias] = authTokenAndAlias;
    const twoHours = 2 * 60 * 60 * 1000;
    if (Date.now() - authToken.timestamp > twoHours) {
      await this._authTokenDAO.deleteAuthToken(token);
      throw new Error("[unauthorized] Auth token expired");
    }
    return alias;
  }
}
