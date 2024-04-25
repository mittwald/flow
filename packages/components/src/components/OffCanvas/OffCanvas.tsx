import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./OffCanvas.module.scss";
import clsx from "clsx";
import type { OverlayState } from "@/lib/controller/overlay";
import { useOverlayState } from "@/lib/controller/overlay/useOverlayState";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import Overlay from "@/components/Overlay/Overlay";
import { useSyncTriggerState } from "@/components/Overlay/hooks/useSyncTriggerState";

export interface OffCanvasProps extends PropsWithChildren {
  state?: OverlayState;
  defaultOpen?: boolean;
  className?: string;
}

export const OffCanvas: FC<OffCanvasProps> = (props) => {
  const { state: stateFromProps, defaultOpen, children, className } = props;

  const newState = useOverlayState({
    reuseControllerFromContext: false,
    defaultOpen,
  });

  const state = stateFromProps ?? newState;

  useSyncTriggerState(state);

  const rootClassName = clsx(styles.offCanvas, className);

  const propsContext: PropsContext = {
    Link: {
      onPress: () => state.close(),
    },
  };

  return (
    <Overlay state={state} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <Button
          onPress={() => state.close()}
          style="plain"
          size="s"
          variant="secondary"
          className={styles.closeButton}
        >
          <IconClose />
        </Button>
        {children}
      </PropsContextProvider>
    </Overlay>
  );
};

export default OffCanvas;
