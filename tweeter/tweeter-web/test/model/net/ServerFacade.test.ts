import "isomorphic-fetch";
import { ServerFacade } from "../../../src/model/net/ServerFacade";
import {
  RegisterRequest,
  PagedUserItemRequest,
  GetFollowerCountRequest,
  GetFolloweeCountRequest,
} from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;

  beforeAll(() => {
    serverFacade = new ServerFacade();
  });

  it("should successfully register a user", async () => {
    const request: RegisterRequest = {
      firstName: "Integration",
      lastName: "Test",
      alias: "@integrationtest",
      password: "password123",
      userImageBytes: "base64image",
      imageFileExtension: "png",
    };

    const response = await serverFacade.register(request);

    expect(response).toBeDefined();
    expect(response.success).toBe(true);
    expect(response.user).toBeDefined();
    expect(response.authToken).toBeDefined();
    expect(response.user?.firstName).toBe("Allen"); // FakeData returns Allen
  });

  it("should successfully get a user's followers", async () => {
    const request: PagedUserItemRequest = {
      token: "dummy-token",
      userAlias: "@allen",
      pageSize: 10,
      lastItem: null,
    };

    const response = await serverFacade.getFollowers(request);

    expect(response).toBeDefined();
    expect(response.success).toBe(true);
    expect(response.items).toBeDefined();
    expect(response.items?.length).toBeGreaterThan(0);
    expect(response.hasMore).toBeDefined();
  });

  it("should successfully get the followers and followees count of a user", async () => {
    const countRequest: GetFollowerCountRequest = {
      token: "dummy-token",
      userAlias: "@allen",
    };

    const followerResponse = await serverFacade.getFollowerCount(countRequest);
    const followeeResponse = await serverFacade.getFolloweeCount(countRequest);

    expect(followerResponse).toBeDefined();
    expect(followerResponse.success).toBe(true);
    expect(typeof followerResponse.count).toBe("number");
    expect(followerResponse.count).toBeGreaterThan(0);

    expect(followeeResponse).toBeDefined();
    expect(followeeResponse.success).toBe(true);
    expect(typeof followeeResponse.count).toBe("number");
    expect(followeeResponse.count).toBeGreaterThan(0);
  });
});
