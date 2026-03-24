import {
  PagedUserItemRequest,
  PagedUserItemResponse,
  FakeData,
  User,
} from "tweeter-shared";

export const handler = async (
  request: PagedUserItemRequest,
): Promise<PagedUserItemResponse> => {
  let lastItem: User | null = null;
  if (request.lastItem) {
    lastItem = new User(
      request.lastItem.firstName,
      request.lastItem.lastName,
      request.lastItem.alias,
      request.lastItem.imageUrl,
    );
  }

  const [users, hasMore] = FakeData.instance.getPageOfUsers(
    lastItem,
    request.pageSize,
    request.userAlias,
  );

  const userDtos = users.map((user) => ({
    firstName: user.firstName,
    lastName: user.lastName,
    alias: user.alias,
    imageUrl: user.imageUrl,
  }));

  return new PagedUserItemResponse(true, userDtos, hasMore, null);
};
