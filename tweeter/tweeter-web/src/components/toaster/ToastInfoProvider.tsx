import { useCallback, useMemo, useState } from "react";
import { Toast, ToastType, makeToast } from "./Toast";
import PropTypes from "prop-types";
import { ToastListContext, ToastActionsContext } from "./ToastContexts";
import { ToastInfoProviderPresenter, ToastInfoProviderView } from "../../presenter/ToastInfoProviderPresenter";

interface Props {
  children: React.ReactNode;
}

const ToastInfoProvider: React.FC<Props> = ({ children }) => {
  const [toastList, setToastList] = useState<Toast[]>([]);

  const listenter: ToastInfoProviderView = {
    setToastList: setToastList,
    makeToast: makeToast
  }
  const presenter: ToastInfoProviderPresenter = new ToastInfoProviderPresenter(listenter);

  const displayExistingToast = useCallback((toast: Toast) => {
    presenter.displayExistingToast(toast);
  }, []);

  const displayToast = useCallback(
    (
      toastType: ToastType,
      message: string,
      duration: number,
      title?: string,
      bootstrapClasses?: string
    ): string => {
      return presenter.displayToast(toastType, message, duration, displayExistingToast, title, bootstrapClasses);
    },
    [displayExistingToast]
  ); 

  const deleteToast = useCallback((id: string) => {
    setToastList((currentList) => presenter.deleteToast(currentList, id));
  }, []);

  const deleteAllToasts = useCallback(() => {
    setToastList([]);
  }, []);

  const toastActions = useMemo(
    () => ({
      displayExistingToast,
      displayToast,
      deleteToast,
      deleteAllToasts,
    }),
    [displayExistingToast, displayToast, deleteToast, deleteAllToasts]
  );

  return (
    <ToastListContext.Provider value={toastList}>
      <ToastActionsContext.Provider value={toastActions}>
        {children}
      </ToastActionsContext.Provider>
    </ToastListContext.Provider>
  );
};

ToastInfoProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ToastInfoProvider;