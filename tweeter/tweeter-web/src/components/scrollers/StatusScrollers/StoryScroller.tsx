import { Status } from "tweeter-shared";
import { PagedPresenterView } from "../../../presenter/PagedPresenters/PagedPresenter";
import { StoryPresenter } from "../../../presenter/PagedPresenters/StatusPresenters/StoryPresenter";
import ItemScroller from "../ItemScroller";
import StatusItem from "../../statusItem/StatusItem";

const StoryScroller = () => {
  return (
    <ItemScroller
      presenterFactory={(view: PagedPresenterView<Status>) =>
        new StoryPresenter(view)
      }
      renderItem={(item: Status) => (
        <StatusItem item={item} featurePath="story" />
      )}
    />
  );
};

export default StoryScroller;
