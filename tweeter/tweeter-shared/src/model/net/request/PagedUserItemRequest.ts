import { TweeterRequest } from "./TweeterRequest";
import { UserDto } from "../dto/UserDto"; // Adjust path to where your UserDto is

export interface PagedUserItemRequest extends TweeterRequest {
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: UserDto | null;
}
