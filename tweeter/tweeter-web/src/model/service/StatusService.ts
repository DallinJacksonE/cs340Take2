import {
  AuthToken,
  Status,
  User,
  PagedStatusItemRequest,
  PostStatusRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class StatusService implements Service {
  private server: ServerFacade = new ServerFacade();

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem
        ? {
            post: lastItem.post,
            user: {
              firstName: lastItem.user.firstName,
              lastName: lastItem.user.lastName,
              alias: lastItem.user.alias,
              imageUrl: lastItem.user.imageUrl,
            },
            timestamp: lastItem.timestamp,
          }
        : null,
    };

    const response = await this.server.getStory(request);

    if (response.success && response.items) {
      const statuses = response.items.map(
        (dto) =>
          new Status(
            dto.post,
            new User(
              dto.user.firstName,
              dto.user.lastName,
              dto.user.alias,
              dto.user.imageUrl,
            ),
            dto.timestamp,
          ),
      );
      return [statuses, response.hasMore];
    } else {
      throw new Error(
        response.message ?? "An error occurred loading story items",
      );
    }
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem
        ? {
            post: lastItem.post,
            user: {
              firstName: lastItem.user.firstName,
              lastName: lastItem.user.lastName,
              alias: lastItem.user.alias,
              imageUrl: lastItem.user.imageUrl,
            },
            timestamp: lastItem.timestamp,
          }
        : null,
    };

    const response = await this.server.getFeed(request);

    if (response.success && response.items) {
      const statuses = response.items.map(
        (dto) =>
          new Status(
            dto.post,
            new User(
              dto.user.firstName,
              dto.user.lastName,
              dto.user.alias,
              dto.user.imageUrl,
            ),
            dto.timestamp,
          ),
      );
      return [statuses, response.hasMore];
    } else {
      throw new Error(
        response.message ?? "An error occurred loading feed items",
      );
    }
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    const request: PostStatusRequest = {
      token: authToken.token,
      newStatus: {
        post: newStatus.post,
        user: {
          firstName: newStatus.user.firstName,
          lastName: newStatus.user.lastName,
          alias: newStatus.user.alias,
          imageUrl: newStatus.user.imageUrl,
        },
        timestamp: newStatus.timestamp,
      },
    };

    await this.server.postStatus(request);
  }
}
