import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter, View } from "./Presenter";

export interface LogoutView extends MessageView {
  clearUserInfo: () => void;
  navigate: (url: string) => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private _service: UserService;

  constructor(view: LogoutView) {
    super(view);
    this._service = new UserService();
  }

  public async logout(authToken: AuthToken): Promise<void> {
    await this.doFailureReporting(async () => {
      const loggingOutToastId = this.view.displayInfoMessage(
        "Logging Out...",
        0,
      );
      await this._service.logout(authToken);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "logout");
  }
}
