import { AuthToken } from "tweeter-shared";

export interface AuthTokenDAO {
  putAuthToken(token: AuthToken, alias: string): Promise<void>;
  getAuthToken(token: string): Promise<[AuthToken, string] | null>;
  deleteAuthToken(token: string): Promise<void>;
}
