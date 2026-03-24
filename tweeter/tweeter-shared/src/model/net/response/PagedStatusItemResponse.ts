import { TweeterResponse } from "./TweeterResponse";
import { StatusDto } from "../dto/StatusDto";

export class PagedStatusItemResponse extends TweeterResponse {
  readonly items: StatusDto[] | null;
  readonly hasMore: boolean;

  constructor(
    success: boolean,
    items: StatusDto[] | null,
    hasMore: boolean,
    message: string | null = null,
  ) {
    super(success, message);
    this.items = items;
    this.hasMore = hasMore;
  }
}
