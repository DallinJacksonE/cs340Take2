import {
  PostStatusRequest,
  TweeterResponse,
  Status,
  User,
} from "tweeter-shared";
import { StatusService } from "../service/StatusService";

export const handler = async (
  request: PostStatusRequest,
): Promise<TweeterResponse> => {
  const statusService = new StatusService();
  const status = new Status(
    request.newStatus.post,
    new User(
      request.newStatus.user.firstName,
      request.newStatus.user.lastName,
      request.newStatus.user.alias,
      request.newStatus.user.imageUrl,
    ),
    request.newStatus.timestamp,
  );
  await statusService.postStatus(request.token, status);
  return new TweeterResponse(true, null);
};
