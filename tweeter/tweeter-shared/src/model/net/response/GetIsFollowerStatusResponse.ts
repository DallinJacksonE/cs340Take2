import { TweeterResponse } from "./TweeterResponse";

export class GetIsFollowerStatusResponse extends TweeterResponse {
  readonly isFollower: boolean;

  constructor(
    success: boolean,
    isFollower: boolean,
    message: string | null = null,
  ) {
    super(success, message);
    this.isFollower = isFollower;
  }
}
