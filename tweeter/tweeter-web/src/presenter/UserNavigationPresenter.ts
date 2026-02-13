import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { To } from "react-router-dom";

export interface UserNaviagtionView {
  navigate: (to: To) => void,
  displayErrorMessage: (value: string) => void,
  setDisplayedUser: (user: User) => void,
  displayedUser: User,
  authToken: AuthToken
}

export class UserNaviagtionPresenter {
  private _service: UserService = new UserService();
  private _view: UserNaviagtionView;
  public constructor(view: UserNaviagtionView) {
    this._view = view;
  }
  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this._service.getUser(authToken, alias);
  }


  public async navigateToUser(event: React.MouseEvent): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());
      console.log(`Event:${event.target.toString()}`)
      const toUser = await this._service.getUser(this._view.authToken!, alias);
      const feature = this.extractFeature(event.target.toString());
      console.log(`Alias: ${alias} toUser: ${toUser} Feature:${feature}`)
      if (toUser) {
        if (!toUser.equals(this._view.displayedUser!)) {
          this._view.setDisplayedUser(toUser);
          this._view.navigate(`/${feature}/${alias}`);
        }
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`,
      );
    }
  };

  extractFeature(value: string): string {
    console.log(`Extract Feature value:${value}`)
    const regex = /:\/\/[^/]+\/([^/]+)\/@[^/]+/;
    const matches = value.match(regex);
    console.log(matches);
    if (matches) {
      return matches[1];
    }
    console.log("No Feature found");
    return 'noFeat';
  }

  extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  };


}