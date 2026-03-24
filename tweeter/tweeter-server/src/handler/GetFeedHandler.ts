import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
} from "tweeter-shared";
import { StatusService } from "../service/StatusService";

export const handler = async (
  request: PagedStatusItemRequest,
): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService();
  const [statuses, hasMore] = await statusService.loadMoreFeedItems(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem ? request.lastItem.timestamp : null,
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
