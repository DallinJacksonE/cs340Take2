import { AuthTokenDAO } from "./AuthTokenDAO";
import { FollowDAO } from "./FollowDAO";
import { S3DAO } from "./S3DAO";
import { StatusDAO } from "./StatusDAO";
import { UserDAO } from "./UserDAO";

export interface DAOFactory {
  getUserDAO(): UserDAO;
  getFollowDAO(): FollowDAO;
  getStatusDAO(): StatusDAO;
  getAuthTokenDAO(): AuthTokenDAO;
  getS3DAO(): S3DAO;
}
