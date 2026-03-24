import { TweeterResponse } from "./TweeterResponse";
import { UserDto } from "../dto/UserDto";

export class GetUserResponse extends TweeterResponse {
  readonly user: UserDto | null;

  constructor(
    success: boolean,
    user: UserDto | null,
    message: string | null = null,
  ) {
    super(success, message);
    this.user = user;
  }
}
