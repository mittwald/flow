import { ToastState, useToastState } from "@react-stately/toast";
import React, { FC, ReactElement } from "react";
import ToastRegion from "../ToastRegion";
import { ToastContentProps } from "../../Toast";

export interface ToastProviderProps {
  children: (item: ToastState<ToastContentProps>) => ReactElement;
}

export const ToastProvider: FC<ToastProviderProps> = ({
  children,
  ...props
}) => {
  const state: ToastState<ToastContentProps> = useToastState({
    maxVisibleToasts: 5,
  });

  return (
    <>
      {children(state)}
      {state.visibleToasts.length > 0 && (
        <ToastRegion {...props} state={state} />
      )}
    </>
  );
};

export default ToastProvider;
