import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./OffCanvas.module.scss";
import clsx from "clsx";
import type { OverlayController } from "@/lib/controller/overlay";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import { Action } from "@/components/Action";
import { ModalOverlay } from "@/components/ModalOverlay";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { Header } from "@/components/Header";

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
      tunnelId: "heading",
      levelVisual: 4,
      level: 2,
    },
  };

  return (
    <ModalOverlay controller={controller} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <Header className={styles.header}>
            <TunnelExit id="heading" />
            <Action closeOverlay>
              <Button
                variant="plain"
                color="secondary"
                className={styles.closeButton}
              >
                <IconClose />
              </Button>
            </Action>
          </Header>

          {children}
        </TunnelProvider>
      </PropsContextProvider>
    </ModalOverlay>
  );
};

export default OffCanvas;
