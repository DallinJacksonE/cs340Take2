import { FollowerPresenter } from "../../../../presenter/PagedPresenters/UserPresenters/FollowersPresenter";
import { User } from "tweeter-shared";
import UserItem from "../../../userItem/UserItem";
import { PagedPresenterView } from "../../../../presenter/PagedPresenters/PagedPresenter";
import ItemScroller from "../ItemScroller";

const FollowersScroller = () => {
  return (
    <ItemScroller
      presenterFactory={(view: PagedPresenterView<User>) =>
        new FollowerPresenter(view)
      }
      renderItem={(item: User) => (
        <UserItem user={item} featurePath="followers" />
      )}
    />
  );
};

export default FollowersScroller;
