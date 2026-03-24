import { UnfollowRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../service/UserService";

export const handler = async (
  request: UnfollowRequest,
): Promise<TweeterResponse> => {
  const userService = new UserService();
  await userService.unfollow(request.token, request.userToUnfollow.alias);
  return new TweeterResponse(true, null);
};
