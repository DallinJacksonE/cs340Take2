import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { Presenter, View } from "../Presenter";

export interface AuthenticationView extends View {
  setIsLoading: (isLoading: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    rememberMe: boolean,
  ) => void;
  navigate: (url: string) => void;
}

export abstract class AuthenticationPresenter extends Presenter<AuthenticationView> {
  protected _service: UserService = new UserService();

  constructor(view: AuthenticationView) {
    super(view);
  }

  protected get service(): UserService {
    return this._service;
  }

  protected async doAuthentication(
    operation: () => Promise<[User, AuthToken]>,
    operationName: string,
    rememberMe: boolean,
    originalUrl?: string,
  ) {
    await this.doFailureReporting(
      async () => {
        this.view.setIsLoading(true);
        const [user, authToken] = await operation();
        this.view.updateUserInfo(user, user, authToken, rememberMe);
        this.view.navigate(originalUrl ?? `/feed/${user.alias}`);
      },
      operationName,
      () => {
        this.view.setIsLoading(false);
      },
    );
  }
}
