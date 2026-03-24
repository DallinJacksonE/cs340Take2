export class TweeterResponse {
  success: boolean;
  message: string | null;

  constructor(success: boolean, message: string | null = null) {
    this.success = success;
    this.message = message;
  }
}
