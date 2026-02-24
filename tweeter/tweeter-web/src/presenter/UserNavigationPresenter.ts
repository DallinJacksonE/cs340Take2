import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { To } from "react-router-dom";
import { Presenter, View } from "./Presenter";

export interface UserNaviagtionView extends View {
  navigate: (to: To) => void;
  setDisplayedUser: (user: User) => void;
  displayedUser: User;
  authToken: AuthToken;
}

export class UserNaviagtionPresenter extends Presenter<UserNaviagtionView> {
  private _service: UserService = new UserService();
  public constructor(view: UserNaviagtionView) {
    super(view);
  }
  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    return this._service.getUser(authToken, alias);
  }

  public async navigateToUser(event: React.MouseEvent): Promise<void> {
    event.preventDefault();
    this.doFailureReporting(async () => {
      const alias = this.extractAlias(event.target.toString());
      console.log(`Event:${event.target.toString()}`);
      const toUser = await this._service.getUser(this.view.authToken!, alias);
      const feature = this.extractFeature(event.target.toString());
      console.log(`Alias: ${alias} toUser: ${toUser} Feature:${feature}`);
      if (toUser) {
        if (!toUser.equals(this.view.displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`/${feature}/${alias}`);
        }
      }
    }, "get user");
  }

  extractFeature(value: string): string {
    console.log(`Extract Feature value:${value}`);
    const regex = /:\/\/[^/]+\/([^/]+)\/@[^/]+/;
    const matches = value.match(regex);
    console.log(matches);
    if (matches) {
      return matches[1];
    }
    console.log("No Feature found");
    return "noFeat";
  }

  extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
