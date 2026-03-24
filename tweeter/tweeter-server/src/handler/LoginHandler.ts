import { LoginRequest, AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../service/UserService";

export const handler = async (
  request: LoginRequest,
): Promise<AuthenticateResponse> => {
  try {
    const userService = new UserService();
    const [user, authToken] = await userService.login(
      request.alias,
      request.password,
    );

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
  } catch (error: any) {
    // API Gateway will catch errors that contain "[bad-request]" and return a 400 status code
    // or "[internal-server-error]" for a 500 status code as defined in your template.yml
    throw new Error(`[internal-server-error] ${error.message}`);
  }
};
