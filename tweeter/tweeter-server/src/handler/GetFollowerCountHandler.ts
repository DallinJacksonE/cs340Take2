import {
  GetFollowerCountRequest,
  GetFollowerCountResponse,
  FakeData,
} from "tweeter-shared";

export const handler = async (
  request: GetFollowerCountRequest,
): Promise<GetFollowerCountResponse> => {
  const count = await FakeData.instance.getFollowerCount(request.userAlias);
  return new GetFollowerCountResponse(true, count, null);
};
