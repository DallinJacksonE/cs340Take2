import { Toast, ToastType } from "../components/toaster/Toast";
import { Presenter, View } from "./Presenter";

export interface ToastInfoProviderView extends View {
  setToastList: (value: Toast[] | ((previousList: Toast[]) => Toast[])) => void;
  makeToast: (
    toastType: ToastType,
    message: string,
    duration: number,
    title?: string,
    bootstrapClasses?: string,
  ) => Toast;
}

export interface ToastActions {
  displayExistingToast: (toast: Toast) => void;
  displayToast: (
    toastType: ToastType,
    message: string,
    duration: number,
    title?: string,
    bootstrapClasses?: string,
  ) => string;
  deleteToast: (id: string) => void;
  deleteAllToasts: () => void;
}

export class ToastInfoProviderPresenter extends Presenter<ToastInfoProviderView> {
  constructor(view: ToastInfoProviderView) {
    super(view);
  }

  public displayExistingToast(toast: Toast): void {
    this.view.setToastList((previousList: Toast[]) => [...previousList, toast]);
  }

  private _displayToast(
    toastType: ToastType,
    message: string,
    duration: number,
    title?: string,
    bootstrapClasses?: string,
  ): string {
    const toast = this.view.makeToast(
      toastType,
      message,
      duration,
      title,
      bootstrapClasses,
    );
    this.displayExistingToast(toast);
    return toast.id;
  }

  private _deleteToast(currentList: Toast[], id: string): Toast[] {
    const filtered = currentList.filter((x: Toast) => x.id !== id);
    return filtered;
  }

  private _deleteAllToasts(): void {
    this.view.setToastList([]);
  }

  public getToastActions(
    useCallback: <T extends (...args: any[]) => any>(
      callback: T,
      dependencies: any[],
    ) => T,
    useMemo: <T>(factory: () => T, dependencies: any[]) => T,
  ): ToastActions {
    const displayExistingToast = useCallback(
      (toast: Toast) => this.displayExistingToast(toast),
      [],
    );

    const displayToast = useCallback(
      (
        toastType: ToastType,
        message: string,
        duration: number,
        title?: string,
        bootstrapClasses?: string,
      ) =>
        this._displayToast(
          toastType,
          message,
          duration,
          title,
          bootstrapClasses,
        ),
      [],
    );

    const deleteToast = useCallback(
      (id: string) =>
        this.view.setToastList((currentList: Toast[]) =>
          this._deleteToast(currentList, id),
        ),
      [],
    );

    const deleteAllToasts = useCallback(() => this._deleteAllToasts(), []);

    return useMemo(
      () => ({
        displayExistingToast,
        displayToast,
        deleteToast,
        deleteAllToasts,
      }),
      [displayExistingToast, displayToast, deleteToast, deleteAllToasts],
    );
  }
}
