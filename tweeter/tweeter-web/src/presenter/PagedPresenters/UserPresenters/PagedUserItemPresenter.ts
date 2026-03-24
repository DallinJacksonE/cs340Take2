import { User } from "tweeter-shared";
import { PagedPresenter, PagedPresenterView } from "../PagedPresenter";
import { FollowService } from "../../../model/service/FollowService";

export abstract class PagedUserItemPresenter extends PagedPresenter<
  User,
  FollowService
> {
  constructor(view: PagedPresenterView<User>) {
    super(view);
  }

  createService(): FollowService {
    return new FollowService();
  }
}
