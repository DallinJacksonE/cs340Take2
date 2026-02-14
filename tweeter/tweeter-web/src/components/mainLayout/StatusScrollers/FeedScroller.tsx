import { Status } from "tweeter-shared";
import StatusItemScroller from "./StatusItemScroller";
import { FeedPresenter } from "../../../presenter/StatusPresenters/FeedPresenter";
import { ScrollableItemView } from "../../../presenter/ScrollableItemPresenter";

const FeedScroller = () => {
  return (
    <StatusItemScroller pageType="feed" presenterFactory={(view: ScrollableItemView<Status>) => new FeedPresenter(view)} />
  )
};

export default FeedScroller;
