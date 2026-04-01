import { User } from "tweeter-shared";

export interface FollowDAO {
  getFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null,
  ): Promise<[User[], boolean]>;
  getFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null,
  ): Promise<[User[], boolean]>;
  isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
  follow(followerAlias: string, followeeAlias: string): Promise<void>;
  unfollow(followerAlias: string, followeeAlias: string): Promise<void>;
  getAllFollowerAliases(followeeAlias: string): Promise<string[]>;
}
