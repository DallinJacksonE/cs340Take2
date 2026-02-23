import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "../Presenter";

export interface PagedPresenterView<ITEM> extends View {
  addItems: (items: ITEM[]) => void;
}

export abstract class PagedPresenter<T, U> extends Presenter<
  PagedPresenterView<T>
> {
  private _hasMoreItems: boolean = true;
  private _lastItem: T | null = null;
  protected _service: U;
  protected _pageSize: number = 10;

  constructor(view: PagedPresenterView<T>) {
    super(view);
    this._service = this.createService();
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value: T | null) {
    this._lastItem = value;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  abstract createService(): U;

  //service call for the items needed
  abstract getMoreItems(
    authToken: AuthToken,
    user: User,
  ): Promise<[T[], boolean]>;

  //string for the error logging
  abstract serviceGetCallDescription(): string;

  //logic for any paged presenter loading more
  public loadMoreItems(authToken: AuthToken, user: User): Promise<void> {
    return this.doFailureReporting(async () => {
      const [newItems, hasMore] = await this.getMoreItems(authToken, user);
      this.hasMoreItems = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    }, this.serviceGetCallDescription());
  }
}
