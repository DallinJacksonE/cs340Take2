import { TweeterRequest } from "./TweeterRequest";

export interface GetFolloweeCountRequest extends TweeterRequest {
  readonly userAlias: string;
}
