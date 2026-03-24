import { UnfollowRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (
  request: UnfollowRequest,
): Promise<TweeterResponse> => {
  // For Milestone 3, we just return a successful response
  return new TweeterResponse(true, null);
};
