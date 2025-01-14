import type { FC, PropsWithChildren } from "react";
import React from "react";
import {
  overlayContext,
  useOverlayContext,
} from "~/lib/controller/overlay/context";
import type { FlowComponentName } from "~/components/propTypes";
import type { OverlayController } from "~/lib/controller";

interface Props extends PropsWithChildren {
  type: FlowComponentName;
  controller: OverlayController;
}

export const OverlayContextProvider: FC<Props> = (props) => {
  const { type, controller, children } = props;
  const parentContext = useOverlayContext();

  return (
    <overlayContext.Provider
      value={{
        ...parentContext,
        [type]: controller,
      }}
    >
      {children}
    </overlayContext.Provider>
  );
};

export default OverlayContextProvider;
