import {
  GetFolloweeCountRequest,
  GetFolloweeCountResponse,
} from "tweeter-shared";
import { UserService } from "../service/UserService";

export const handler = async (
  request: GetFolloweeCountRequest,
): Promise<GetFolloweeCountResponse> => {
  const userService = new UserService();
  const count = await userService.getFolloweeCount(
    request.token,
    request.userAlias,
  );
  return new GetFolloweeCountResponse(true, count, null);
};
