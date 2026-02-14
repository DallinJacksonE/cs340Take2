import UserItemScroller from "./UserItemScroller";
import { FolloweePresenter } from "../../../presenter/UserPresenters/FolloweePresenter";
import { ScrollableItemView } from "../../../presenter/ScrollableItemPresenter";
import { User } from "tweeter-shared";

const FolloweesScroller = () => {

  return (
    <UserItemScroller pageType="followees" presenterFactory={(view: ScrollableItemView<User>) => new FolloweePresenter(view)} />
  )
};

export default FolloweesScroller;
