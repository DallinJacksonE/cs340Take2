import {
  AuthToken,
  User,
  LoginRequest,
  RegisterRequest,
  GetUserRequest,
  GetFollowerCountRequest,
  GetFolloweeCountRequest,
  FollowRequest,
  UnfollowRequest,
  LogoutRequest,
  GetIsFollowerStatusRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class UserService implements Service {
  private server: ServerFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    const request: GetUserRequest = {
      token: authToken.token,
      userAlias: alias,
    };
    const response = await this.server.getUser(request);

    if (response.success && response.user) {
      return new User(
        response.user.firstName,
        response.user.lastName,
        response.user.alias,
        response.user.imageUrl,
      );
    }
    return null;
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> {
    const request: GetIsFollowerStatusRequest = {
      token: authToken.token,
      follower: {
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.alias,
        imageUrl: user.imageUrl,
      },
      followee: {
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        alias: selectedUser.alias,
        imageUrl: selectedUser.imageUrl,
      },
    };

    const response = await this.server.getIsFollowerStatus(request);
    if (response.success) {
      return response.isFollower;
    } else {
      throw new Error(response.message ?? "Failed to get follower status");
    }
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    const request: GetFolloweeCountRequest = {
      token: authToken.token,
      userAlias: user.alias,
    };
    const response = await this.server.getFolloweeCount(request);
    if (response.success) {
      return response.count;
    } else {
      throw new Error(response.message ?? "Failed to get followee count");
    }
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    const request: GetFollowerCountRequest = {
      token: authToken.token,
      userAlias: user.alias,
    };
    const response = await this.server.getFollowerCount(request);
    if (response.success) {
      return response.count;
    } else {
      throw new Error(response.message ?? "Failed to get follower count");
    }
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowRequest = {
      token: authToken.token,
      userToFollow: {
        firstName: userToFollow.firstName,
        lastName: userToFollow.lastName,
        alias: userToFollow.alias,
        imageUrl: userToFollow.imageUrl,
      },
    };

    const response = await this.server.follow(request);
    if (!response.success) {
      throw new Error(response.message ?? "Failed to follow user");
    }

    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: UnfollowRequest = {
      token: authToken.token,
      userToUnfollow: {
        firstName: userToUnfollow.firstName,
        lastName: userToUnfollow.lastName,
        alias: userToUnfollow.alias,
        imageUrl: userToUnfollow.imageUrl,
      },
    };

    const response = await this.server.unfollow(request);
    if (!response.success) {
      throw new Error(response.message ?? "Failed to unfollow user");
    }

    const followerCount = await this.getFollowerCount(
      authToken,
      userToUnfollow,
    );
    const followeeCount = await this.getFolloweeCount(
      authToken,
      userToUnfollow,
    );

    return [followerCount, followeeCount];
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[User, AuthToken]> {
    const request: LoginRequest = { alias, password };
    const response = await this.server.login(request);

    if (response.success && response.user && response.authToken) {
      const user = new User(
        response.user.firstName,
        response.user.lastName,
        response.user.alias,
        response.user.imageUrl,
      );
      const authToken = new AuthToken(
        response.authToken.token,
        response.authToken.timestamp,
      );

      return [user, authToken];
    } else {
      throw new Error(response.message ?? "Login failed");
    }
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    image: string,
  ): Promise<[User, AuthToken]> {
    const request: RegisterRequest = {
      firstName,
      lastName,
      alias,
      password,
      userImageBytes: image,
      imageFileExtension: "png", // TODO: Milestone 4 - Get actual extension from image
    };
    const response = await this.server.register(request);

    if (response.success && response.user && response.authToken) {
      const user = new User(
        response.user.firstName,
        response.user.lastName,
        response.user.alias,
        response.user.imageUrl,
      );
      const authToken = new AuthToken(
        response.authToken.token,
        response.authToken.timestamp,
      );

      return [user, authToken];
    } else {
      throw new Error(response.message ?? "Registration failed");
    }
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = {
      token: authToken.token,
    };

    await this.server.logout(request);
  }
}
