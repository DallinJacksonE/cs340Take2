import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {}

export class RegisterPresenter extends AuthenticationPresenter {
  constructor(view: RegisterView) {
    super(view);
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    image: string,
    rememberMe: boolean,
  ) {
    await this.doAuthentication(
      () => this.service.register(firstName, lastName, alias, password, image),
      "register",
      rememberMe,
    );
  }

  public checkSubmitButtonStatus(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    image: File | null,
  ): boolean {
    return !firstName || !lastName || !alias || !password || !image;
  }
}
