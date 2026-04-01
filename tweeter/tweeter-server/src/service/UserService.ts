import { User, AuthToken } from "tweeter-shared";
import * as bcrypt from "bcryptjs";
import { DAOFactory } from "../db/DAOs/DAOInterfaces/DAOFactory";
import { DynamoDAOFactory } from "../db/DynamoDAOFactory";
import { UserDAO } from "../db/DAOs/DAOInterfaces/UserDAO";
import { FollowDAO } from "../db/DAOs/DAOInterfaces/FollowDAO";
import { S3DAO } from "../db/DAOs/DAOInterfaces/S3DAO";
import { v4 as uuidv4 } from "uuid";
import { BaseService } from "./BaseService";

export class UserService extends BaseService {
  private _userDAO: UserDAO;
  private _followDAO: FollowDAO;
  private _s3DAO: S3DAO;

  constructor(daoFactory: DAOFactory = new DynamoDAOFactory()) {
    super(daoFactory);
    this._userDAO = daoFactory.getUserDAO();
    this._followDAO = daoFactory.getFollowDAO();
    this._s3DAO = daoFactory.getS3DAO();
  }

  public async getUser(token: string, userAlias: string): Promise<User | null> {
    await this.getAliasFromToken(token);
    return this._userDAO.getUser(userAlias);
  }

  public async getIsFollowerStatus(
    token: string,
    followerAlias: string,
    followeeAlias: string,
  ): Promise<boolean> {
    await this.getAliasFromToken(token);
    return this._followDAO.isFollower(followerAlias, followeeAlias);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    await this.getAliasFromToken(token);
    return this._userDAO.getFollowersCount(userAlias);
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    await this.getAliasFromToken(token);
    return this._userDAO.getFolloweesCount(userAlias);
  }

  public async follow(
    token: string,
    userToFollowAlias: string,
  ): Promise<[number, number]> {
    const currentUserAlias = await this.getAliasFromToken(token);
    await this._followDAO.follow(currentUserAlias, userToFollowAlias);
    await this._userDAO.updateFollowersCount(userToFollowAlias, 1);
    await this._userDAO.updateFolloweesCount(currentUserAlias, 1);

    const followerCount =
      await this._userDAO.getFollowersCount(userToFollowAlias);
    const followeeCount =
      await this._userDAO.getFolloweesCount(currentUserAlias);
    return [followerCount, followeeCount]; // Return counts for the user being followed and the current user
  }

  public async unfollow(
    token: string,
    userToUnfollowAlias: string,
  ): Promise<[number, number]> {
    const currentUserAlias = await this.getAliasFromToken(token);
    await this._followDAO.unfollow(currentUserAlias, userToUnfollowAlias);
    await this._userDAO.updateFollowersCount(userToUnfollowAlias, -1);
    await this._userDAO.updateFolloweesCount(currentUserAlias, -1);

    const followerCount =
      await this._userDAO.getFollowersCount(userToUnfollowAlias);
    const followeeCount =
      await this._userDAO.getFolloweesCount(currentUserAlias);
    return [followerCount, followeeCount]; // Return counts for the user being unfollowed and the current user
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[User, AuthToken]> {
    const userData = await this._userDAO.getUserWithPassword(alias);

    if (!userData) {
      throw new Error("[bad-request] User not found");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      userData.hashedPassword,
    );
    if (!passwordMatch) {
      throw new Error("[bad-request] Invalid password");
    }

    const authToken = new AuthToken(uuidv4(), Date.now());
    await this._authTokenDAO.putAuthToken(authToken, alias);

    return [userData.user, authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
  ): Promise<[User, AuthToken]> {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

    const imageUrl = await this._s3DAO.putImage(alias, userImageBytes);

    const newUser = new User(firstName, lastName, alias, imageUrl);
    await this._userDAO.putUser(
      firstName,
      lastName,
      alias,
      hashedPassword,
      salt,
      imageUrl,
    );

    const authToken = new AuthToken(uuidv4(), Date.now());
    await this._authTokenDAO.putAuthToken(authToken, alias);

    return [newUser, authToken];
  }

  public async logout(token: string): Promise<void> {
    await this.getAliasFromToken(token);
    await this._authTokenDAO.deleteAuthToken(token);
  }
}
