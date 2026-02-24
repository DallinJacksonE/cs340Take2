import { User } from "tweeter-shared";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {}

export class LoginPresenter extends AuthenticationPresenter {
  constructor(view: LoginView) {
    super(view);
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string,
  ) {
    await this.doAuthentication(
      () => this._service.login(alias, password),
      "login",
      rememberMe,
      originalUrl,
    );
  }

  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  }
}
