import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import StatusItemScroller from "./StatusItemScroller";

export const PAGE_SIZE = 10;

const FeedScroller = () => {

  const loadMoreFeedItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  return (
    <StatusItemScroller featurePath={"feed"} loadMoreFunction={loadMoreFeedItems} />);
};

export default FeedScroller;
