import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../service/FollowService";

export const handler = async (
  request: PagedUserItemRequest,
): Promise<PagedUserItemResponse> => {
  const followService = new FollowService();
  const [users, hasMore] = await followService.loadMoreFollowees(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem ? request.lastItem.alias : null,
  );

  const userDtos = users.map((user) => ({
    firstName: user.firstName,
    lastName: user.lastName,
    alias: user.alias,
    imageUrl: user.imageUrl,
  }));

  return new PagedUserItemResponse(true, userDtos, hasMore, null);
};
