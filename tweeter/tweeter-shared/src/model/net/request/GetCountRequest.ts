import { TweeterRequest } from "./TweeterRequest";

export interface GetCountRequest extends TweeterRequest {
  readonly userAlias: string;
}
