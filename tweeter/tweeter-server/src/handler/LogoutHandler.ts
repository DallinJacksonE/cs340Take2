import { LogoutRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (
  request: LogoutRequest,
): Promise<TweeterResponse> => {
  // For Milestone 3, we just return a successful response
  return new TweeterResponse(true, null);
};
