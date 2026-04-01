import { Status } from "tweeter-shared";

export interface StatusDAO {
  getStory(
    userAlias: string,
    pageSize: number,
    lastStatus: Status | null,
  ): Promise<[Status[], boolean]>;
  getFeed(
    userAlias: string,
    pageSize: number,
    lastStatus: Status | null,
  ): Promise<[Status[], boolean]>;
  postStatus(status: Status): Promise<void>;
  putFeedBatch(userAliases: string[], status: Status): Promise<void>;
}
