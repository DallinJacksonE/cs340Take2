import { FolloweePresenter } from "../../../../presenter/PagedPresenters/UserPresenters/FolloweePresenter";
import { User } from "tweeter-shared";
import { PagedPresenterView } from "../../../../presenter/PagedPresenters/PagedPresenter";
import UserItem from "../../../userItem/UserItem";
import ItemScroller from "../ItemScroller";

const FolloweesScroller = () => {
  return (
    <ItemScroller
      presenterFactory={(view: PagedPresenterView<User>) =>
        new FolloweePresenter(view)
      }
      renderItem={(item: User) => (
        <UserItem user={item} featurePath="followees" />
      )}
    />
  );
};

export default FolloweesScroller;
