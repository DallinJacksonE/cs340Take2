import { AuthenticateResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../service/UserService";

export const handler = async (
  request: RegisterRequest,
): Promise<AuthenticateResponse> => {
  const userService = new UserService();
  const [user, authToken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
  );

  if (!user || !authToken)
    throw new Error("[internal-server-error] Registration failed");

  return new AuthenticateResponse(
    true,
    {
      firstName: user.firstName,
      lastName: user.lastName,
      alias: user.alias,
      imageUrl: user.imageUrl,
    },
    {
      token: authToken.token,
      timestamp: authToken.timestamp,
    },
    null,
  );
};
