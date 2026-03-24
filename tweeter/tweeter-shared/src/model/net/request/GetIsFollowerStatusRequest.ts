import { TweeterRequest } from "./TweeterRequest";
import { UserDto } from "../dto/UserDto";

export interface GetIsFollowerStatusRequest extends TweeterRequest {
  readonly follower: UserDto;
  readonly followee: UserDto;
}
