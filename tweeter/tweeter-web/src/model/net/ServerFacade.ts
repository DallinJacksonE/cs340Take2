import { ClientCommunicator } from "./ClientCommunicator";
// TODO: Update these imports to match your actual Request/Response DTO class names from tweeter-shared
import {
  LoginRequest,
  RegisterRequest,
  AuthenticateResponse,
  GetUserRequest,
  GetUserResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  GetFollowerCountRequest,
  GetFollowerCountResponse,
  GetFolloweeCountRequest,
  GetFolloweeCountResponse,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PostStatusRequest,
  TweeterResponse,
  FollowRequest,
  UnfollowRequest,
  LogoutRequest,
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
} from "tweeter-shared";

export class ServerFacade {
  private SERVER_URL =
    "https://ihjouw21yk.execute-api.us-east-1.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async login(request: LoginRequest): Promise<AuthenticateResponse> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthenticateResponse
    >(request, "/login");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred during login");
    }
  }

  public async register(
    request: RegisterRequest,
  ): Promise<AuthenticateResponse> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      AuthenticateResponse
    >(request, "/register");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(
        response.message ?? "An error occurred during registration",
      );
    }
  }

  public async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/getUser");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred getting the user");
    }
  }

  public async getIsFollowerStatus(
    request: GetIsFollowerStatusRequest,
  ): Promise<GetIsFollowerStatusResponse> {
    const response = await this.clientCommunicator.doPost<
      GetIsFollowerStatusRequest,
      GetIsFollowerStatusResponse
    >(request, "/getIsFollowerStatus");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(
        response.message ?? "An error occurred getting follower status",
      );
    }
  }

  public async getFollowers(
    request: PagedUserItemRequest,
  ): Promise<PagedUserItemResponse> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/getFollowers");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(
        response.message ?? "An error occurred getting followers",
      );
    }
  }

  public async getFollowees(
    request: PagedUserItemRequest,
  ): Promise<PagedUserItemResponse> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/getFollowees");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(
        response.message ?? "An error occurred getting followees",
      );
    }
  }

  public async getFollowerCount(
    request: GetFollowerCountRequest,
  ): Promise<GetFollowerCountResponse> {
    const response = await this.clientCommunicator.doPost<
      GetFollowerCountRequest,
      GetFollowerCountResponse
    >(request, "/getFollowerCount");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(
        response.message ?? "An error occurred getting follower count",
      );
    }
  }

  public async getFolloweeCount(
    request: GetFolloweeCountRequest,
  ): Promise<GetFolloweeCountResponse> {
    const response = await this.clientCommunicator.doPost<
      GetFolloweeCountRequest,
      GetFolloweeCountResponse
    >(request, "/getFolloweeCount");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(
        response.message ?? "An error occurred getting followee count",
      );
    }
  }

  public async getStory(
    request: PagedStatusItemRequest,
  ): Promise<PagedStatusItemResponse> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/getStory");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred getting story");
    }
  }

  public async getFeed(
    request: PagedStatusItemRequest,
  ): Promise<PagedStatusItemResponse> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/getFeed");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred getting feed");
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/postStatus");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? "An error occurred posting status");
    }
  }

  public async follow(request: FollowRequest): Promise<TweeterResponse> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      TweeterResponse
    >(request, "/follow");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred following user");
    }
  }

  public async unfollow(request: UnfollowRequest): Promise<TweeterResponse> {
    const response = await this.clientCommunicator.doPost<
      UnfollowRequest,
      TweeterResponse
    >(request, "/unfollow");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? "An error occurred unfollowing user");
    }
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      TweeterResponse
    >(request, "/logout");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? "An error occurred during logout");
    }
  }
}
