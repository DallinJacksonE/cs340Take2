import { PostStatusRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (
  request: PostStatusRequest,
): Promise<TweeterResponse> => {
  // For Milestone 3, we just return a successful response
  return new TweeterResponse(true, null);
};
