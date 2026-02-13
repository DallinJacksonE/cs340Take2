import { AuthToken } from "tweeter-shared";

export interface ScrollableItemView<ITEM> {
  addItems: (items: ITEM[]) => void,
  displayErrorMessage: (message: string) => void
}

export type PresenterType = "followee" | "follower" | "story" | "feed";
export const PAGE_SIZE = 10;

export abstract class ScrollableItemPresenter<ITEM> {

  private _view: ScrollableItemView<ITEM>;
  private _hasMoreItems: boolean = true;
  private _lastItem: ITEM | null = null;
  private _type: PresenterType;

  protected constructor(view: ScrollableItemView<ITEM>, type: PresenterType) {
    this._view = view;
    this._type = type;
  }

  protected get view() {
    return this._view;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value: ITEM | null) {
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

  abstract serviceCallLoadMore(authToken: AuthToken, userAlias: string, PAGE_SIZE: number): Promise<[ITEM[], boolean]>

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this.serviceCallLoadMore(authToken, userAlias, PAGE_SIZE);
      this.hasMoreItems = hasMore;
      this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load ${this._type}s because of exception: ${error}`,
      );
    }
  };
}