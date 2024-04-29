import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./OffCanvas.module.scss";
import clsx from "clsx";
import type { OverlayController } from "@/lib/controller/overlay";
import { useOverlayController } from "@/lib/controller/overlay";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import Overlay from "@/components/Overlay/Overlay";
import { useSyncTriggerState } from "@/components/Overlay/hooks/useSyncTriggerState";

export interface OffCanvasProps extends PropsWithChildren {
  controller?: OverlayController;
  defaultOpen?: boolean;
  className?: string;
  /** @internal */
  reuseControllerFromContext?: boolean;
}

export const OffCanvas: FC<OffCanvasProps> = (props) => {
  const {
    controller: controllerFromProps,
    defaultOpen,
    children,
    className,
    reuseControllerFromContext = false,
  } = props;

  const newController = useOverlayController({
    reuseControllerFromContext,
    defaultOpen,
  });

  const controller = controllerFromProps ?? newController;

  useSyncTriggerState(controller);

  const rootClassName = clsx(styles.offCanvas, className);

  const propsContext: PropsContext = {
    Link: {
      render: (Link, props) => (
        <Link
          {...props}
          onPress={(e) => {
            props.onPress && props.onPress(e);
            controller.close();
          }}
        />
      ),
    },
  };

  return (
    <Overlay controller={controller} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <Button
          onPress={() => controller.close()}
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
