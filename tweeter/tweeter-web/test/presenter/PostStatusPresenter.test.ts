// AppNavbarPresenter in video intruction
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import {
  LogoutPresenter,
  LogoutView,
} from "../../src/presenter/LogoutPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusPresenterView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;

  const authToken: AuthToken = new AuthToken("foo", Date.now());
  // will need a user and a status
  const user: User = new User("Foo", "baz", "Johndoe", "imageurl");
  const post: Status = new Status("Hello World!", user, Date.now());

  beforeEach(() => {
    mockPostStatusPresenterView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusPresenterView);
    when(mockPostStatusPresenterView.authToken).thenReturn(authToken);
    when(mockPostStatusPresenterView.currentUser).thenReturn(user);
    when(
      mockPostStatusPresenterView.displayInfoMessage(anything(), 0),
    ).thenReturn("messageID_foo");

    postStatusPresenter = new PostStatusPresenter(mockPostStatusViewInstance);
    mockService = mock<StatusService>();
    const mockServiceInstance = instance(mockService);

    // Manually replace the private _service field with the mock service
    (postStatusPresenter as any)._service = mockServiceInstance;
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost("testing status post");
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0),
    ).once();
  });

  it("calls postStatus on post status service with correct status string and authtoken", async () => {
    await postStatusPresenter.submitPost("testing status post");
    verify(mockService.postStatus(authToken, anything())).once();
    const [usedAuthToken, usedStatus] = capture(mockService.postStatus).last();
    expect(usedAuthToken).toEqual(authToken);
    expect(usedStatus.post).toEqual("testing status post");
  });

  it("tells the view to clear the info message displayed previously, clear post, display status posted message on success", async () => {
    await postStatusPresenter.submitPost(
      "testing successful completion of functionality",
    );
    verify(mockPostStatusPresenterView.setPost("")).once();
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000),
    ).once();
    verify(mockPostStatusPresenterView.deleteMessage("messageID_foo")).once();
    verify(mockPostStatusPresenterView.setIsLoading(false)).once();
  });

  it("tells view to clear info message, display an error message, does not tell it to clear post or display status posted message on error", async () => {
    let error = new Error("submit post error");
    when(mockService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submitPost("testing successful error handling");
    verify(mockPostStatusPresenterView.deleteMessage("messageID_foo")).once();
    verify(mockPostStatusPresenterView.setIsLoading(false)).once();
    // no calls
    verify(mockPostStatusPresenterView.setPost("")).never();
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000),
    ).never();
    //ereror message
    verify(
      mockPostStatusPresenterView.displayErrorMessage(
        "Failed to post status because of exception: submit post error",
      ),
    ).once();
  });
});
