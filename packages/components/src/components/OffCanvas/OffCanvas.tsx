import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./OffCanvas.module.scss";
import clsx from "clsx";
import type { OverlayController } from "@/lib/controller/overlay";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import { Action } from "@/components/Action";
import { Overlay } from "@/components/Overlay";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";

export interface OffCanvasProps extends PropsWithChildren {
  controller?: OverlayController;
  className?: string;
}

export const OffCanvas: FC<OffCanvasProps> = (props) => {
  const { controller, children, className } = props;

  const rootClassName = clsx(styles.offCanvas, className);

  const propsContext: PropsContext = {
    Heading: {
      slot: "title",
    },
  };

  return (
    <Overlay controller={controller} className={rootClassName}>
      <Action closeOverlay>
        <Button
          variant="plain"
          size="s"
          color="secondary"
          className={styles.closeButton}
        >
          <IconClose />
        </Button>
      </Action>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Overlay>
  );
};

export default OffCanvas;
