import { User } from "tweeter-shared";

export interface UserDAO {
  getUser(alias: string): Promise<User | null>;
  putUser(
    firstName: string,
    lastName: string,
    alias: string,
    hashedPassword: string,
    salt: string,
    imageUrl: string,
  ): Promise<void>;
  getUserWithPassword(
    alias: string,
  ): Promise<{ user: User; hashedPassword: string; salt: string } | null>;
  getFollowersCount(alias: string): Promise<number>;
  getFolloweesCount(alias: string): Promise<number>;
  updateFollowersCount(alias: string, value: number): Promise<void>;
  updateFolloweesCount(alias: string, value: number): Promise<void>;
}
