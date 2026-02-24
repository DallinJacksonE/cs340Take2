import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { To } from "react-router-dom";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (value: boolean) => void;
  setFolloweeCount: (value: number) => void;
  setFollowerCount: (value: number) => void;
  setIsLoading: (value: boolean) => void;
  setDisplayedUser: (value: User) => void;
  navigate: (to: To) => void;
}
export class UserInfoPresenter extends Presenter<UserInfoView> {
  private _service: UserService = new UserService();
  constructor(view: UserInfoView) {
    super(view);
  }
  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    this.doFailureReporting(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this._service.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!,
          ),
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReporting(async () => {
      this.view.setFolloweeCount(
        await this._service.getFolloweeCount(authToken, displayedUser),
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReporting(async () => {
      this.view.setFollowerCount(
        await this._service.getFollowerCount(authToken, displayedUser),
      );
    }, "get followers count");
  }

  public switchToLoggedInUser(
    event: React.MouseEvent,
    currentUser: User,
  ): void {
    event.preventDefault();
    this.view.setDisplayedUser(currentUser!);
    this.view.navigate(`${this.getBaseUrl()}/${currentUser!.alias}`);
  }

  public getBaseUrl(): string {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  }

  public async followDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    event.preventDefault();
    let followingUserToast = "";
    this.doFailureReporting(
      async () => {
        this.view.setIsLoading(true);
        followingUserToast = this.view.displayInfoMessage(
          `Following ${displayedUser!.name}...`,
          0,
        );

        const [followerCount, followeeCount] = await this._service.follow(
          authToken!,
          displayedUser!,
        );

        this.view.setIsFollower(true);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      "follow user",
      () => {
        this.view.deleteMessage(followingUserToast);
        this.view.setIsLoading(false);
      },
    );
  }

  // call service unffollow
  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    event.preventDefault();
    let unfollowingUserToast = "";
    this.doFailureReporting(
      async () => {
        this.view.setIsLoading(true);
        unfollowingUserToast = this.view.displayInfoMessage(
          `Unfollowing ${displayedUser!.name}...`,
          0,
        );

        const [followerCount, followeeCount] = await this._service.unfollow(
          authToken!,
          displayedUser!,
        );

        this.view.setIsFollower(false);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      "unfollow user",
      () => {
        this.view.deleteMessage(unfollowingUserToast);
        this.view.setIsLoading(false);
      },
    );
  }
}
