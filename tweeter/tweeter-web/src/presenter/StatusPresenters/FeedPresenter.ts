import { AuthToken, Status } from "tweeter-shared";
import { ScrollableItemPresenter, ScrollableItemView } from "../ScrollableItemPresenter";
import { StatusService } from "../../model.service/StatusService";

export class FeedPresenter extends ScrollableItemPresenter<Status> {
  private service = new StatusService();

  public constructor(view: ScrollableItemView<Status>) {
    super(view, "feed");
  }

  serviceCallLoadMore(authToken: AuthToken, userAlias: string, PAGE_SIZE: number): Promise<[Status[], boolean]> {
    return this.service.loadMoreFeedItems(authToken, userAlias, PAGE_SIZE, this.lastItem);
  }
}