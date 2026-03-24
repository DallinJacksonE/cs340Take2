import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../service/UserService";

export const handler = async (
  request: GetUserRequest,
): Promise<GetUserResponse> => {
  const userService = new UserService();
  const user = await userService.getUser(request.token, request.userAlias);

  if (!user) {
    throw new Error("[bad-request] User not found");
  }

  return new GetUserResponse(
    true,
    {
      firstName: user.firstName,
      lastName: user.lastName,
      alias: user.alias,
      imageUrl: user.imageUrl,
    },
    null,
  );
};
