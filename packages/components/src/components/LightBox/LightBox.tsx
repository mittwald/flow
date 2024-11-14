import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { PropsWithChildren } from "react";
import React from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import { Overlay } from "@/components/Overlay";
import clsx from "clsx";
import type { OverlayController } from "@/lib/controller";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import { Action } from "@/components/Action";
import styles from "./LightBox.module.scss";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";

export interface LightBoxProps
  extends PropsWithChildren,
    FlowComponentProps,
    PropsWithClassName {
  controller?: OverlayController;
  fitScreen?: boolean;
}

export const LightBox = flowComponent("LightBox", (props) => {
  const {
    controller,
    children,
    refProp: ignoredRef,
    className,
    fitScreen = true,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.lightBox,
    fitScreen && styles.fitScreen,
    className,
  );

  const propsContext: PropsContext = {
    ActionGroup: {
      className: styles.actionGroup,
      Button: { variant: "soft", color: "light" },
      tunnelId: "actionGroup",
      ignoreBreakpoint: true,
    },
  };

  return (
    <Overlay
      overlayType="LightBox"
      className={rootClassName}
      controller={controller}
      {...rest}
    >
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <div className={styles.content}>{children}</div>
          <div className={styles.actions}>
            <Action closeOverlay="LightBox">
              <Button color="light" variant="soft">
                <IconClose />
              </Button>
            </Action>
            <TunnelExit id="actionGroup" />
          </div>
        </TunnelProvider>
      </PropsContextProvider>
    </Overlay>
  );
});

export default LightBox;
