import { TweeterRequest } from "./TweeterRequest";
import { StatusDto } from "../dto/StatusDto";

export interface PostStatusRequest extends TweeterRequest {
  readonly newStatus: StatusDto;
}
