import {
  AuthenticateResponse,
  RegisterRequest,
  FakeData,
} from "tweeter-shared";

export const handler = async (
  request: RegisterRequest,
): Promise<AuthenticateResponse> => {
  // For Milestone 3, we just return dummy data from FakeData
  const user = FakeData.instance.firstUser;
  const authToken = FakeData.instance.authToken;

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
