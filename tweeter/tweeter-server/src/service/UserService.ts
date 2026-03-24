import { User, AuthToken, FakeData } from "tweeter-shared";

export class UserService {
  public async login(
    alias: string,
    password: string,
  ): Promise<[User, AuthToken]> {
    // TODO: Milestone 4 - Replace with actual database interaction
    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("User not found");
    }
    const authToken = FakeData.instance.authToken;

    return [user, authToken];
  }
}
