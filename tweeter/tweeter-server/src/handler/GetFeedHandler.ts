import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  FakeData,
  Status,
  User,
} from "tweeter-shared";

export const handler = async (
  request: PagedStatusItemRequest,
): Promise<PagedStatusItemResponse> => {
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

  const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(
    lastItem,
    request.pageSize,
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
