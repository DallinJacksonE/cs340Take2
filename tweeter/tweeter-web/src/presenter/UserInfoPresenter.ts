import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { To } from "react-router-dom";


export interface UserInfoView {
  setIsFollower: (value: boolean) => void,
  setFolloweeCount: (value: number) => void,
  setFollowerCount: (value: number) => void,
  setIsLoading: (value: boolean) => void,
  displayErrorMessage: (value: string) => void,
  displayInfoMessage: (value: string, duration: number) => string,
  deleteMessage: (value: string) => void,
  setDisplayedUser: (value: User) => void,
  navigate: (to: To) => void
}
export class UserInfoPresenter {
  private _view: UserInfoView;
  private _service: UserService = new UserService();
  constructor(view: UserInfoView) {
    this._view = view;
  }
  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this._view.setIsFollower(false);
      } else {
        this._view.setIsFollower(
          await this._service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`,
      );
    }
  };

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this._view.setFolloweeCount(await this._service.getFolloweeCount(authToken, displayedUser));
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`,
      );
    }
  };


  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this._view.setFollowerCount(await this._service.getFollowerCount(authToken, displayedUser));
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`,
      );
    }
  };

  public switchToLoggedInUser(event: React.MouseEvent, currentUser: User): void {
    event.preventDefault();
    this._view.setDisplayedUser(currentUser!);
    this._view.navigate(`${this.getBaseUrl()}/${currentUser!.alias}`);
  };

  public getBaseUrl(): string {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };

  public async followDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    event.preventDefault();
    var followingUserToast = "";

    try {
      this._view.setIsLoading(true);
      followingUserToast = this._view.displayInfoMessage(
        `Following ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this._service.follow(
        authToken!,
        displayedUser!
      );

      this._view.setIsFollower(true);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`,
      );
    } finally {
      this._view.deleteMessage(followingUserToast);
      this._view.setIsLoading(false);
    }
  };

  // call service unffollow
  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    event.preventDefault();
    var unfollowingUserToast = "";

    try {
      this._view.setIsLoading(true);
      unfollowingUserToast = this._view.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this._service.unfollow(
        authToken!,
        displayedUser!
      );

      this._view.setIsFollower(false);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`,
      );
    } finally {
      this._view.deleteMessage(unfollowingUserToast);
      this._view.setIsLoading(false);
    }
  };
}