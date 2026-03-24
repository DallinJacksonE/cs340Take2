import { Status, FakeData } from "tweeter-shared";

export class StatusService {
  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    // TODO: Milestone 4 - Replace with actual database interaction
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    // TODO: Milestone 4 - Replace with actual database interaction
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async postStatus(token: string, newStatus: Status): Promise<void> {
    // TODO: Milestone 4 - Replace with actual database interaction
  }
}
