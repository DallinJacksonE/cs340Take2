import { AuthToken, User, FakeData } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LoginView {
  setIsLoading: (isLoading: boolean) => void;
  navigate: (url: string) => void;
  displayErrorMessage: (message: string) => void;
  updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, rememberMe: boolean) => void;
}

export class LoginPresenter {
  private _view: LoginView;
  private _service: UserService = new UserService();

  constructor(view: LoginView) {
    this._view = view;
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string
  ) {
    try {
      this._view.setIsLoading(true);

      const [user, authToken] = await this._service.login(alias, password);

      this._view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this._view.navigate(originalUrl);
      } else {
        this._view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this._view.setIsLoading(false);
    }
  }
}