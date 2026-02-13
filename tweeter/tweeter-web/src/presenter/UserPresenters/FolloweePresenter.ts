import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../../model.service/FollowService";
import { ScrollableItemPresenter, ScrollableItemView } from "../ScrollableItemPresenter";

export class FolloweePresenter extends ScrollableItemPresenter<User> {
  private service = new FollowService();

  public constructor(view: ScrollableItemView<User>) {
    super(view, "followee");
  }

  serviceCallLoadMore(authToken: AuthToken, userAlias: string, PAGE_SIZE: number): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowers(authToken, userAlias, PAGE_SIZE, this.lastItem);
  }
}