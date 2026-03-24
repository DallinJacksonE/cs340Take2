import { TweeterResponse } from "./TweeterResponse";
import { UserDto } from "../dto/UserDto";

export class PagedUserItemResponse extends TweeterResponse {
  readonly items: UserDto[] | null;
  readonly hasMore: boolean;

  constructor(
    success: boolean,
    items: UserDto[] | null,
    hasMore: boolean,
    message: string | null = null,
  ) {
    super(success, message);
    this.items = items;
    this.hasMore = hasMore;
  }
}
