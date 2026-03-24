import {
  GetFolloweeCountRequest,
  GetFolloweeCountResponse,
  FakeData,
} from "tweeter-shared";

export const handler = async (
  request: GetFolloweeCountRequest,
): Promise<GetFolloweeCountResponse> => {
  const count = await FakeData.instance.getFolloweeCount(request.userAlias);
  return new GetFolloweeCountResponse(true, count, null);
};
