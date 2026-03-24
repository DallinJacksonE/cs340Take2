import { FollowRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../service/UserService";

export const handler = async (
  request: FollowRequest,
): Promise<TweeterResponse> => {
  const userService = new UserService();
  await userService.follow(request.token, request.userToFollow.alias);
  return new TweeterResponse(true, null);
};
