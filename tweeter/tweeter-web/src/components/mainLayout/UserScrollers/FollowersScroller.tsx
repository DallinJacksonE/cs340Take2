import UserItemScroller from "./UserItemScroller";
import { FollowerPresenter } from "../../../presenter/UserPresenters/FollowersPresenter";
import { ScrollableItemView } from "../../../presenter/ScrollableItemPresenter";
import { User } from "tweeter-shared";

export const PAGE_SIZE = 10;


const FollowersScroller = () => {
  return (
    <UserItemScroller pageType="followers" presenterFactory={(view: ScrollableItemView<User>) => new FollowerPresenter(view)} />
  )
};

export default FollowersScroller;
