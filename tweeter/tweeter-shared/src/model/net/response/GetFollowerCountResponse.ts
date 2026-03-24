import { TweeterResponse } from "./TweeterResponse";

export class GetFollowerCountResponse extends TweeterResponse {
  readonly count: number;

  constructor(success: boolean, count: number, message: string | null = null) {
    super(success, message);
    this.count = count;
  }
}
