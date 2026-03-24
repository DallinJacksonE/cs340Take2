import { GetUserRequest, GetUserResponse, FakeData } from "tweeter-shared";

export const handler = async (
  request: GetUserRequest,
): Promise<GetUserResponse> => {
  // For Milestone 3, we just return dummy data from FakeData
  const user = FakeData.instance.findUserByAlias(request.userAlias); // Adapt 'userAlias' to match your DTO

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
