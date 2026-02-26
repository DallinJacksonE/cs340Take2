import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (value: boolean) => void;
  currentUser: User | null;
  authToken: AuthToken | null;
  setPost: (value: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _service: StatusService = new StatusService();

  public constructor(view: PostStatusView) {
    super(view);
  }

  public get service() {
    return this._service;
  }

  public async submitPost(post: string) {
    var postingStatusToastId = "";
    await this.doFailureReporting(
      async () => {
        this.view.setIsLoading(true);
        postingStatusToastId = this.view.displayInfoMessage(
          "Posting status...",
          0,
        );

        const status = new Status(post, this.view.currentUser!, Date.now());

        await this._service.postStatus(this.view.authToken!, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post status",
      () => {
        this.view.deleteMessage(postingStatusToastId);
        this.view.setIsLoading(false);
      },
    );
  }

  public clearPost() {
    this.view.setPost("");
  }

  public checkButtonStatus(post: string): boolean {
    return !post.trim() || !this.view.authToken || !this.view.currentUser;
  }
}
