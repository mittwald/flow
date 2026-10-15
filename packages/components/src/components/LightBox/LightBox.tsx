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
import DivView from "@/views/DivView";
import ButtonView from "@/views/ButtonView";
import LightBoxZoomView from "@/views/LightBoxZoomView";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";

export interface LightBoxProps
  extends PropsWithChildren, FlowComponentProps, PropsWithClassName {
  /** An overlay controller to control the light box state. */
  controller?: OverlayController;
  /**
   * Whether content can be displayed larger than the available space in the
   * screen. @default true
   */
  fitScreen?: boolean;
  /**
   * Whether the content can be zoomed. Applies to the items of a
   * `LightBoxGallery` as well. The content then always fits the screen,
   * whatever `fitScreen` says. @default false
   */
  withZoom?: boolean;
}

export const LightBox = flowComponent("LightBox", (props) => {
  const {
    controller: controllerFromProps,
    children,
    ref: ignoredRef,
    className,
    fitScreen = true,
    withZoom,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.lightBox,
    (fitScreen || withZoom) && styles.fitScreen,
    className,
  );

  const propsContext: PropsContext = {
    ActionGroup: {
      preserveOrder: true,
      spacing: "m",
      className: styles.actionGroup,
      Button: { variant: "solid", color: "light-static" },
      tunnel: {
        id: "actionGroup",
        component: "LightBox",
      },
    },
    LightBoxGallery: {
      className: styles.gallery,
      LightBoxGalleryItem: { withZoom },
    },
  };

  const controllerFromContext = useOverlayController("LightBox", {
    reuseControllerFromContext: true,
  });

  const controller = controllerFromProps ?? controllerFromContext;

  const stringFormatter = useLocalizedStringFormatter(locales, "LightBox");

  const zoomableContent = (
    <LightBoxZoomView className={styles.zoom}>{children}</LightBoxZoomView>
  );

  return (
    <Overlay
      overlayType="LightBox"
      className={rootClassName}
      controller={controller}
      {...rest}
    >
      <PropsContextProvider props={propsContext}>
        <DivView className={styles.content}>
          {withZoom ? zoomableContent : children}
        </DivView>
        <DivView className={styles.actions}>
          <UiComponentTunnelExit id="actionGroup" component="LightBox" />
          <ButtonView
            color="light-static"
            variant="solid"
            onPress={() => controller.close()}
            aria-label={stringFormatter.format("close")}
          >
            <IconClose />
          </ButtonView>
        </DivView>
      </PropsContextProvider>
    </Overlay>
  );
});

export default LightBox;
