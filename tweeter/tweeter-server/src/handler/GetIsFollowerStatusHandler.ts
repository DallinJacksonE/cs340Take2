import {
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  FakeData,
} from "tweeter-shared";

export const handler = async (
  request: GetIsFollowerStatusRequest,
): Promise<GetIsFollowerStatusResponse> => {
  const isFollower = await FakeData.instance.isFollower();
  return new GetIsFollowerStatusResponse(true, isFollower, null);
};
