import {
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
} from "tweeter-shared";
import { UserService } from "../service/UserService";

export const handler = async (
  request: GetIsFollowerStatusRequest,
): Promise<GetIsFollowerStatusResponse> => {
  const userService = new UserService();
  const isFollower = await userService.getIsFollowerStatus(
    request.token,
    request.follower.alias,
    request.followee.alias,
  );
  return new GetIsFollowerStatusResponse(true, isFollower, null);
};
