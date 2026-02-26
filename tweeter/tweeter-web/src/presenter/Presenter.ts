export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (value: string, duration: number) => string;
  deleteMessage: (value: string) => void;
}

export abstract class Presenter<V extends View> {
  private _view: V;

  protected constructor(view: V) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  protected async doFailureReporting(
    operation: () => Promise<void>,
    operationName: string,
    finalOperation?: () => void,
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationName} because of exception: ${(error as Error).message}`,
      );
    } finally {
      if (finalOperation) {
        finalOperation();
      }
    }
  }
}
