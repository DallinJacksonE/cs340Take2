import "isomorphic-fetch";
import { ServerFacade } from "../../../src/model/net/ServerFacade";
import {
  RegisterRequest,
  PagedUserItemRequest,
  GetFollowerCountRequest,
} from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;
  let validToken: string;
  let testUserAlias: string;

  // A completely valid, tiny 1x1 pixel transparent PNG base64 string so S3 doesn't crash
  const tinyImageBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  jest.setTimeout(20000);

  beforeAll(async () => {
    serverFacade = new ServerFacade();
    testUserAlias = `@setupUser${Date.now()}`;

    const registerRequest: RegisterRequest = {
      firstName: "Setup",
      lastName: "User",
      alias: testUserAlias,
      password: "password123",
      userImageBytes: tinyImageBase64,
      imageFileExtension: "png",
    };

    const registerResponse = await serverFacade.register(registerRequest);
    if (!registerResponse.success || !registerResponse.authToken) {
      throw new Error("Failed to register setup user before running tests!");
    }

    validToken = registerResponse.authToken.token;
  });

  it("should successfully register a user", async () => {
    const uniqueAlias = `@integrationtest${Date.now()}`;
    const request: RegisterRequest = {
      firstName: "Integration",
      lastName: "Test",
      alias: uniqueAlias,
      password: "password123",
      userImageBytes: tinyImageBase64,
      imageFileExtension: "png",
    };

    const response = await serverFacade.register(request);

    expect(response).toBeDefined();
    expect(response.success).toBe(true);
    expect(response.user).toBeDefined();
    expect(response.authToken).toBeDefined();
    expect(response.user?.alias).toBe(uniqueAlias);
  });

  it("should successfully get a user's followers", async () => {
    const request: PagedUserItemRequest = {
      token: validToken,
      userAlias: testUserAlias,
      pageSize: 10,
      lastItem: null,
    };

    const response = await serverFacade.getFollowers(request);

    expect(response).toBeDefined();
    expect(response.success).toBe(true);
    expect(response.items).toBeDefined();
  });

  it("should successfully get the followers and followees count of a user", async () => {
    const countRequest: GetFollowerCountRequest = {
      token: validToken,
      userAlias: testUserAlias,
    };

    const followerResponse = await serverFacade.getFollowerCount(countRequest);
    const followeeResponse = await serverFacade.getFolloweeCount(countRequest);

    expect(followerResponse).toBeDefined();
    expect(followerResponse.success).toBe(true);
    expect(typeof followerResponse.count).toBe("number");

    expect(followeeResponse).toBeDefined();
    expect(followeeResponse.success).toBe(true);
    expect(typeof followeeResponse.count).toBe("number");
  });
});
