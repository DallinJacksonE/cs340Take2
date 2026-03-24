import { TweeterRequest } from "./TweeterRequest";

export interface GetFollowerCountRequest extends TweeterRequest {
  readonly userAlias: string;
}
