import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export class LogoutPresenter {
  private _service: UserService;

  constructor() {
    this._service = new UserService();
  }

  public async logout(authToken: AuthToken): Promise<void> {
    await this._service.logout(authToken);
  }
}