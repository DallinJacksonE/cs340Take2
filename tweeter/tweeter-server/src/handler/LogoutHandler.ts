import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../service/UserService";

export const handler = async (
  request: LogoutRequest,
): Promise<TweeterResponse> => {
  const userService = new UserService();
  await userService.logout(request.token);
  return new TweeterResponse(true, null);
};
