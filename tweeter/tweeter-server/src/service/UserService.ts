import { User, AuthToken, FakeData } from "tweeter-shared";
import * as crypto from "crypto";

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

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
  ): Promise<[User, AuthToken]> {
    // 1. Generate a random salt
    const salt = crypto.randomBytes(16).toString("base64");

    // 2. Hash the password combined with the salt
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("base64");

    // TODO: Milestone 4 - Save the alias, firstName, lastName, userImageBytes, salt, and hashedPassword to DynamoDB

    // For now, return FakeData
    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("User not found");
    }
    const authToken = FakeData.instance.authToken;

    return [user, authToken];
  }
}
