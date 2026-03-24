import {
  GetFollowerCountRequest,
  GetFollowerCountResponse,
} from "tweeter-shared";
import { UserService } from "../service/UserService";

export const handler = async (
  request: GetFollowerCountRequest,
): Promise<GetFollowerCountResponse> => {
  const userService = new UserService();
  const count = await userService.getFollowerCount(
    request.token,
    request.userAlias,
  );
  return new GetFollowerCountResponse(true, count, null);
};
