import { User, AuthToken, FakeData } from "tweeter-shared";
import * as crypto from "crypto";

export class UserService {
  public async getUser(token: string, userAlias: string): Promise<User | null> {
    // TODO: Milestone 4 - Replace with actual database interaction
    return FakeData.instance.findUserByAlias(userAlias);
  }

  public async getIsFollowerStatus(
    token: string,
    followerAlias: string,
    followeeAlias: string,
  ): Promise<boolean> {
    // TODO: Milestone 4 - Replace with actual database interaction
    return FakeData.instance.isFollower();
  }

  public async getFollowerCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    // TODO: Milestone 4 - Replace with actual database interaction
    return FakeData.instance.getFollowerCount(userAlias);
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    // TODO: Milestone 4 - Replace with actual database interaction
    return FakeData.instance.getFolloweeCount(userAlias);
  }

  public async follow(
    token: string,
    userToFollowAlias: string,
  ): Promise<[number, number]> {
    // TODO: Milestone 4 - Replace with actual database interaction
    const followerCount = await this.getFollowerCount(token, userToFollowAlias);
    const followeeCount = await this.getFolloweeCount(token, userToFollowAlias);
    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollowAlias: string,
  ): Promise<[number, number]> {
    // TODO: Milestone 4 - Replace with actual database interaction
    const followerCount = await this.getFollowerCount(
      token,
      userToUnfollowAlias,
    );
    const followeeCount = await this.getFolloweeCount(
      token,
      userToUnfollowAlias,
    );
    return [followerCount, followeeCount];
  }

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

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
  ): Promise<[User, AuthToken]> {
    const salt = crypto.randomBytes(16).toString("base64");

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("base64");

    // TODO: Milestone 4 - Save the alias, firstName, lastName, userImageBytes, salt, and hashedPassword to DynamoDB

    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("User not found");
    }
    const authToken = FakeData.instance.authToken;

    return [user, authToken];
  }

  public async logout(token: string): Promise<void> {
    // TODO: Milestone 4 - Replace with actual database interaction
  }
}
