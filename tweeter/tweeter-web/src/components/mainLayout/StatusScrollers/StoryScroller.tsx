
import { Status } from "tweeter-shared";
import StatusItemScroller from "./StatusItemScroller";
import { StoryPresenter } from "../../../presenter/StatusPresenters/StoryPresenter";
import { ScrollableItemView } from "../../../presenter/ScrollableItemPresenter";

const StoryScroller = () => {
  return (
    <StatusItemScroller pageType="story" presenterFactory={(view: ScrollableItemView<Status>) => new StoryPresenter(view)} />
  )
};

export default StoryScroller;
