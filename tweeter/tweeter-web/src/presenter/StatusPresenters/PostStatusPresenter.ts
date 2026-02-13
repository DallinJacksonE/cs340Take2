import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../model.service/StatusService";

export interface PostStatusView {
  displayInfoMessage: (message: string, duration: number) => string,
  displayErrorMessage: (message: string) => void,
  setIsLoading: (value: boolean) => void,
  deleteMessage: (id: string) => void,
  currentUser: User | null,
  authToken: AuthToken | null,
  setPost: (value: string) => void
}

export class PostStatusPresenter {
  private _view: PostStatusView;
  private _service: StatusService = new StatusService();

  public constructor(view: PostStatusView) {
    this._view = view;
  }

  public async submitPost(event: React.MouseEvent, post: string) {
    event.preventDefault();

    var postingStatusToastId = "";

    try {
      this._view.setIsLoading(true);
      postingStatusToastId = this._view.displayInfoMessage(
        "Posting status...",
        0
      );

      const status = new Status(post, this._view.currentUser!, Date.now());

      await this._service.postStatus(this._view.authToken!, status);

      this._view.setPost("");
      this._view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
      );
    } finally {
      this._view.deleteMessage(postingStatusToastId);
      this._view.setIsLoading(false);
    }
  };

  public clearPost() {
    this._view.setPost("");
  };

  public checkButtonStatus(post: string): boolean {
    return !post.trim() || !this._view.authToken || !this._view.currentUser;
  };


}