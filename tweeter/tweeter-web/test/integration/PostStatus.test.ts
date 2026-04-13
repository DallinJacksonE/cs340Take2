import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { UserService } from "../../src/model/service/UserService";
import { StatusService } from "../../src/model/service/StatusService";
import { AuthToken, User } from "tweeter-shared";
import { instance, spy, verify, anything } from "@typestrong/ts-mockito";
import "isomorphic-fetch";
// 1. Create a dummy class that implements the view interface.
// (ts-mockito works much better with spying on concrete classes than trying to mock interface properties)
class MockPostStatusView implements PostStatusView {
  currentUser: User | null = null;
  authToken: AuthToken | null = null;
  setIsLoading(value: boolean): void {}
  setPost(value: string): void {}
  displayInfoMessage(message: string, duration: number): string {
    return "mock-toast-id";
  }
  displayErrorMessage(message: string): void {}
  clearLastInfoMessage(): void {}
  deleteMessage(id: string): void {}
}

describe("PostStatus Integration Test", () => {
  let userService: UserService;
  let statusService: StatusService;
  let presenter: PostStatusPresenter;
  let mockViewSpy: MockPostStatusView;

  let currentUser: User;
  let authToken: AuthToken;
  jest.setTimeout(20000);
  beforeAll(async () => {
    userService = new UserService();
    statusService = new StatusService();

    const loginResult = await userService.login("@CC", "Test");
    currentUser = loginResult[0];
    authToken = loginResult[1];
  });

  beforeEach(() => {
    const mockViewObj = new MockPostStatusView();
    mockViewSpy = spy(mockViewObj);
    mockViewObj.currentUser = currentUser;
    mockViewObj.authToken = authToken;
    presenter = new PostStatusPresenter(instance(mockViewSpy));
  });

  it("should post a status and append it to the user's story", async () => {
    const uniquePostString = `Integration Test Post: ${Date.now()}`;
    await presenter.submitPost(uniquePostString);

    verify(mockViewSpy.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockViewSpy.setPost("")).once();

    const [story, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      currentUser.alias,
      10,
      null,
    );

    expect(story.length).toBeGreaterThan(0);
    expect(story[0].post).toEqual(uniquePostString);
    expect(story[0].user.alias).toEqual(currentUser.alias);
  }, 20000);
});
