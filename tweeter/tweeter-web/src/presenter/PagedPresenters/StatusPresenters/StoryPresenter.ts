import { AuthToken, Status, User } from "tweeter-shared";
import { PagedStatusItemPresenter } from "./PagedStatusItemPresenter";
import { PagedPresenterView } from "../PagedPresenter";

export class StoryPresenter extends PagedStatusItemPresenter {
  public constructor(view: PagedPresenterView<Status>) {
    super(view);
  }

  getMoreItems(authToken: AuthToken, user: User): Promise<[Status[], boolean]> {
    return this._service.loadMoreStoryItems(
      authToken,
      user.alias,
      this._pageSize,
      this.lastItem,
    );
  }

  serviceGetCallDescription(): string {
    return "get more story statuses";
  }
}
