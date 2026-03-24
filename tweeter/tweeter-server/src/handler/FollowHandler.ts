import { FollowRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (
  request: FollowRequest,
): Promise<TweeterResponse> => {
  // For Milestone 3, we just return a successful response
  return new TweeterResponse(true, null);
};
