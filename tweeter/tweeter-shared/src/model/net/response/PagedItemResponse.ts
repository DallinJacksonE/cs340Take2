import { TweeterResponse } from "./TweeterResponse";

export class PagedItemResponse<Dto> extends TweeterResponse {
  readonly items: Dto[] | null;
  readonly hasMore: boolean;

  constructor(
    success: boolean,
    items: Dto[] | null,
    hasMore: boolean,
    message: string | null = null,
  ) {
    super(success, message);
    this.items = items;
    this.hasMore = hasMore;
  }
}