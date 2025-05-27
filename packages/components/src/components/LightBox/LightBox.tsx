import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { PropsWithChildren } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import { Overlay } from "@/components/Overlay/Overlay";
import clsx from "clsx";
import type { OverlayController } from "@/lib/controller";
import { useOverlayController } from "@/lib/controller";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { IconClose } from "@/components/Icon/components/icons";
import styles from "./LightBox.module.scss";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import DivView from "@/views/DivView";
import ButtonView from "@/views/ButtonView";

export interface LightBoxProps
  extends PropsWithChildren,
    FlowComponentProps,
    PropsWithClassName {
  /** An overlay controller to control the light box state. */
  controller?: OverlayController;
  /**
   * Whether content can be displayed larger than the available space in the
   * screen. @default true
   */
  fitScreen?: boolean;
}

export const LightBox = flowComponent("LightBox", (props) => {
  const {
    controller: controllerFromProps,
    children,
    ref: ignoredRef,
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
    },
  };

  const controllerFromContext = useOverlayController("LightBox", {
    reuseControllerFromContext: true,
  });

  const controller = controllerFromProps ?? controllerFromContext;

  return (
    <Overlay
      overlayType="LightBox"
      className={rootClassName}
      controller={controller}
      {...rest}
    >
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <DivView className={styles.content}>{children}</DivView>
          <DivView className={styles.actions}>
            <ButtonView color="light" variant="soft" onPress={controller.close}>
              <IconClose />
            </ButtonView>
            <TunnelExit id="actionGroup" />
          </DivView>
        </TunnelProvider>
      </PropsContextProvider>
    </Overlay>
  );
});

export default LightBox;
