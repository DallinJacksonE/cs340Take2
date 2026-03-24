import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  Status,
  User,
} from "tweeter-shared";
import { StatusService } from "../service/StatusService";

export const handler = async (
  request: PagedStatusItemRequest,
): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService();

  let lastItem: Status | null = null;
  if (request.lastItem) {
    lastItem = new Status(
      request.lastItem.post,
      new User(
        request.lastItem.user.firstName,
        request.lastItem.user.lastName,
        request.lastItem.user.alias,
        request.lastItem.user.imageUrl,
      ),
      request.lastItem.timestamp,
    );
  }

  const [statuses, hasMore] = await statusService.loadMoreFeedItems(
    request.token,
    request.userAlias,
    request.pageSize,
    lastItem,
  );

  const statusDtos = statuses.map((status) => ({
    post: status.post,
    user: {
      firstName: status.user.firstName,
      lastName: status.user.lastName,
      alias: status.user.alias,
      imageUrl: status.user.imageUrl,
    },
    timestamp: status.timestamp,
  }));

  return new PagedStatusItemResponse(true, statusDtos, hasMore, null);
};
