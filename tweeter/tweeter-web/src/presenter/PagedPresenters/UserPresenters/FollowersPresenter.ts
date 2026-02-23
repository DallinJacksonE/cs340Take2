import { AuthToken, User } from "tweeter-shared";
import { PagedUserItemPresenter } from "./PagedUserItemPresenter";
import { PagedPresenterView } from "../PagedPresenter";

export class FollowerPresenter extends PagedUserItemPresenter {
  public constructor(view: PagedPresenterView<User>) {
    super(view);
  }

  getMoreItems(authToken: AuthToken, user: User): Promise<[User[], boolean]> {
    return this._service.loadMoreFollowers(
      authToken,
      user.alias,
      this._pageSize,
      this.lastItem,
    );
  }

  serviceGetCallDescription(): string {
    return "get more followers";
  }
}
