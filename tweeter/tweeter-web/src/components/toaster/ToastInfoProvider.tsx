import React, { useState, useMemo, useCallback } from "react";
import { Toast, makeToast, ToastType } from "./Toast";
import {
  ToastInfoProviderPresenter,
  ToastInfoProviderView,
  ToastActions,
} from "../../presenter/ToastInfoProviderPresenter";
import { ToastActionsContext, ToastListContext } from "./ToastContexts";
import { useMessageActions } from "./MessageHooks";

interface ToastInfoProviderProps {
  children: React.ReactNode;
}

const ToastInfoProvider: React.FC<ToastInfoProviderProps> = ({ children }) => {
  const [toastList, setToastList] = useState<Toast[]>([]);
  const { displayErrorMessage } = useMessageActions();

  // The view connects the presenter to React's state and other functions.
  const view: ToastInfoProviderView = useMemo(
    () => ({
      displayErrorMessage: displayErrorMessage,

      setToastList: setToastList,
      makeToast: (
        toastType: ToastType,
        message: string,
        duration: number,
        title?: string,
        bootstrapClasses?: string,
      ) => makeToast(toastType, message, duration, title, bootstrapClasses),
    }),
    [],
  );

  const presenter: ToastInfoProviderPresenter = useMemo(
    () => new ToastInfoProviderPresenter(view),
    [view],
  );

  const toastActions: ToastActions = presenter.getToastActions(
    useCallback,
    useMemo,
  );

  return (
    <ToastListContext.Provider value={toastList}>
      <ToastActionsContext.Provider value={toastActions}>
        {children}
      </ToastActionsContext.Provider>
    </ToastListContext.Provider>
  );
};

export default ToastInfoProvider;
