import { TweeterResponse } from "./TweeterResponse"; // Ensure you renamed TweeterRequest.ts to TweeterResponse.ts!
import { UserDto } from "../dto/UserDto";
import { AuthTokenDto } from "../dto/AuthTokenDto";

export class AuthenticateResponse extends TweeterResponse {
  readonly user: UserDto | null;
  readonly authToken: AuthTokenDto | null;

  constructor(
    success: boolean,
    user: UserDto | null,
    authToken: AuthTokenDto | null,
    message: string | null = null,
  ) {
    super(success, message);
    this.user = user;
    this.authToken = authToken;
  }
}
