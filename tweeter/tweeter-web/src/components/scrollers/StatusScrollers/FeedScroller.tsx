import { Status } from "tweeter-shared";
import { PagedPresenterView } from "../../../presenter/PagedPresenters/PagedPresenter";
import { FeedPresenter } from "../../../presenter/PagedPresenters/StatusPresenters/FeedPresenter";
import ItemScroller from "../ItemScroller";
import StatusItem from "../../statusItem/StatusItem";

const FeedScroller = () => {
  return (
    <ItemScroller
      presenterFactory={(view: PagedPresenterView<Status>) =>
        new FeedPresenter(view)
      }
      renderItem={(item: Status) => (
        <StatusItem item={item} featurePath="feed" />
      )}
    />
  );
};

export default FeedScroller;
