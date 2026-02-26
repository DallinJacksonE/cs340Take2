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
  LogoutPresenter,
  LogoutView,
} from "../../src/presenter/LogoutPresenter";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model.service/UserService";

describe("LogoutPresenter", () => {
  let mockLogoutPresenterView: LogoutView;
  let logoutPresenter: LogoutPresenter;
  let mockService: UserService;

  const authToken: AuthToken = new AuthToken("foo", Date.now());

  beforeEach(() => {
    mockLogoutPresenterView = mock<LogoutView>();
    const mockLogoutPresenterViewInstance = instance(mockLogoutPresenterView);
    when(mockLogoutPresenterView.displayInfoMessage(anything(), 0)).thenReturn(
      "messageID_foo",
    );

    logoutPresenter = new LogoutPresenter(mockLogoutPresenterViewInstance);
    mockService = mock<UserService>();
    const mockServiceInstance = instance(mockService);

    // Manually replace the private _service field with the mock service
    (logoutPresenter as any)._service = mockServiceInstance;
  });

  it("tells the view to display a logging out message", async () => {
    await logoutPresenter.logout(authToken);
    verify(
      mockLogoutPresenterView.displayInfoMessage("Logging Out...", 0),
    ).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await logoutPresenter.logout(authToken);
    verify(mockService.logout(authToken)).once();
    let [authTokenUsed] = capture(mockService.logout).last();
    expect(authTokenUsed).toEqual(authToken);
  });

  it("tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page when succesfull", async () => {
    await logoutPresenter.logout(authToken);
    verify(mockLogoutPresenterView.deleteMessage("messageID_foo")).once();
    verify(mockLogoutPresenterView.clearUserInfo()).once();
    verify(mockLogoutPresenterView.displayErrorMessage(anything())).never();
    verify(mockLogoutPresenterView.navigate(anything())).once();
  });

  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page on error", async () => {
    let error = new Error("logout error");
    when(mockService.logout(anything())).thenThrow(error);
    await logoutPresenter.logout(authToken);

    verify(
      mockLogoutPresenterView.displayErrorMessage(
        "Failed to logout because of exception: logout error",
      ),
    ).once();

    verify(mockLogoutPresenterView.deleteMessage(anything())).never();
    verify(mockLogoutPresenterView.clearUserInfo()).never();
    verify(mockLogoutPresenterView.navigate(anything())).never();
  });
});
