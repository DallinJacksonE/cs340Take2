import { AuthToken, User } from "tweeter-shared";
import { PagedUserItemPresenter } from "./PagedUserItemPresenter";
import { PagedPresenterView } from "../PagedPresenter";

export class FolloweePresenter extends PagedUserItemPresenter {
  public constructor(view: PagedPresenterView<User>) {
    super(view);
  }

  getMoreItems(authToken: AuthToken, user: User): Promise<[User[], boolean]> {
    return this._service.loadMoreFollowees(
      authToken,
      user.alias,
      this._pageSize,
      this.lastItem,
    );
  }

  serviceGetCallDescription(): string {
    return "get more followees";
  }
}
