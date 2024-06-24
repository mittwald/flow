import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./OffCanvas.module.scss";
import clsx from "clsx";
import type { OverlayController } from "@/lib/controller/overlay";
import { useOverlayController } from "@/lib/controller/overlay";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import { Action } from "@/components/Action";
import { ModalOverlay } from "@/components/ModalOverlay";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { Header } from "@/components/Header";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";

export interface OffCanvasProps extends PropsWithChildren, FlowComponentProps {
  controller?: OverlayController;
  className?: string;
}

export const OffCanvas = flowComponent("OffCanvas", (props) => {
  const {
    controller: overlayControllerFromProps,
    refProp: ignoredRef,
    children,
    className,
  } = props;

  const rootClassName = clsx(styles.offCanvas, className);
  const overlayControllerFromContext = useOverlayController("OffCanvas", {
    reuseControllerFromContext: true,
  });
  const overlayController =
    overlayControllerFromProps ?? overlayControllerFromContext;

  const propsContext: PropsContext = {
    Heading: {
      slot: "title",
      tunnelId: "heading",
      levelVisual: 4,
      level: 2,
    },
  };

  return (
    <ModalOverlay controller={overlayController} className={rootClassName}>
      <OverlayContextProvider type="OffCanvas" controller={overlayController}>
        <PropsContextProvider props={propsContext}>
          <TunnelProvider>
            <Header className={styles.header}>
              <TunnelExit id="heading" />
              <Action closeOverlay="OffCanvas">
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
      </OverlayContextProvider>
    </ModalOverlay>
  );
});

export default OffCanvas;
