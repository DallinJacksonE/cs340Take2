import { Status } from "tweeter-shared";
import { PagedPresenter, PagedPresenterView } from "../PagedPresenter";
import { StatusService } from "../../../model.service/StatusService";

export abstract class PagedStatusItemPresenter extends PagedPresenter<
  Status,
  StatusService
> {
  constructor(view: PagedPresenterView<Status>) {
    super(view);
  }

  createService(): StatusService {
    return new StatusService();
  }
}
