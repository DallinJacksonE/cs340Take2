import {
  AuthToken,
  User,
  PagedUserItemRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class FollowService implements Service {
  private server: ServerFacade = new ServerFacade();

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollowee: User | null,
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastFollowee
        ? {
            firstName: lastFollowee.firstName,
            lastName: lastFollowee.lastName,
            alias: lastFollowee.alias,
            imageUrl: lastFollowee.imageUrl,
          }
        : null,
    };

    const response = await this.server.getFollowees(request);

    if (response.success && response.items) {
      const users = response.items.map(
        (dto) => new User(dto.firstName, dto.lastName, dto.alias, dto.imageUrl),
      );
      return [users, response.hasMore];
    } else {
      throw new Error(
        response.message ?? "An error occurred loading followees",
      );
    }
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollower: User | null,
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastFollower
        ? {
            firstName: lastFollower.firstName,
            lastName: lastFollower.lastName,
            alias: lastFollower.alias,
            imageUrl: lastFollower.imageUrl,
          }
        : null,
    };

    const response = await this.server.getFollowers(request);

    if (response.success && response.items) {
      const users = response.items.map(
        (dto) => new User(dto.firstName, dto.lastName, dto.alias, dto.imageUrl),
      );
      return [users, response.hasMore];
    } else {
      throw new Error(
        response.message ?? "An error occurred loading followers",
      );
    }
  }
}
