import { User, FakeData } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null,
  ): Promise<[User[], boolean]> {
    // TODO: Milestone 4 - Replace with actual database interaction
    const lastFollower = lastFollowerAlias
      ? FakeData.instance.findUserByAlias(lastFollowerAlias)
      : null;
    return FakeData.instance.getPageOfUsers(lastFollower, pageSize, userAlias);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null,
  ): Promise<[User[], boolean]> {
    // TODO: Milestone 4 - Replace with actual database interaction
    const lastFollowee = lastFolloweeAlias
      ? FakeData.instance.findUserByAlias(lastFolloweeAlias)
      : null;
    return FakeData.instance.getPageOfUsers(lastFollowee, pageSize, userAlias);
  }
}
