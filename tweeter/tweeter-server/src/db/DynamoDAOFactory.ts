import { DAOFactory } from "./DAOs/DAOInterfaces/DAOFactory";
import { AuthTokenDAO } from "./DAOs/DAOInterfaces/AuthTokenDAO";
import { FollowDAO } from "./DAOs/DAOInterfaces/FollowDAO";
import { S3DAO } from "./DAOs/DAOInterfaces/S3DAO";
import { StatusDAO } from "./DAOs/DAOInterfaces/StatusDAO";
import { UserDAO } from "./DAOs/DAOInterfaces/UserDAO";
import { DynamoAuthTokenDAO } from "./DAOs/DynamoDBDAOs/DynamoAuthTokenDAO";
import { DynamoFollowDAO } from "./DAOs/DynamoDBDAOs/DynamoFollowDAO";
import { DynamoS3DAO } from "./DAOs/DynamoDBDAOs/DynamoS3DAO";
import { DynamoStatusDAO } from "./DAOs/DynamoDBDAOs/DynamoStatusDAO";
import { DynamoUserDAO } from "./DAOs/DynamoDBDAOs/DynamoUserDAO";

export class DynamoDAOFactory implements DAOFactory {
  getUserDAO(): UserDAO {
    return new DynamoUserDAO();
  }
  getFollowDAO(): FollowDAO {
    return new DynamoFollowDAO(this.getUserDAO());
  }
  getStatusDAO(): StatusDAO {
    return new DynamoStatusDAO();
  }
  getAuthTokenDAO(): AuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }
  getS3DAO(): S3DAO {
    return new DynamoS3DAO();
  }
}
