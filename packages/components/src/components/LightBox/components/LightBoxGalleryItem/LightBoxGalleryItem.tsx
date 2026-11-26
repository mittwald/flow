import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import styles from "@/components/LightBox/components/LightBoxGallery/LightBoxGallery.module.scss";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { IconClose } from "@/components/Icon/components/icons";
import { useOverlayController } from "@/lib/hooks";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../locales/*.locale.json";
import { Button } from "@/components/Button";
import type { PropsWithChildren, RefAttributes } from "react";
import { LightBoxZoom } from "@/components/LightBox/components/LightBoxZoom";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";

/*
 * Renders no element of its own. `ref` stays accepted as a no-op: the factory
 * used to add it, and dropping it would break consumers' types.
 */
export interface LightBoxGalleryItemProps
  extends
    PropsWithChildren,
    Omit<FlowComponentProps, "ref">,
    RefAttributes<unknown> {
  /**
   * @internal Set by the `withZoom` of the surrounding `LightBox`: whether the
   * item's content can be zoomed.
   */
  withZoom?: boolean;
}

/** @flr-generate all */
export const LightBoxGalleryItem = flowComponent(
  "LightBoxGalleryItem",
  (props) => {
    const { children, withZoom } = props;

    const controller = useOverlayController("Modal");

    const propsContext: PropsContext = {
      ActionGroup: {
        spacing: "m",
        className: styles.actionGroup,
        Button: { color: "light-static" },
        tunnel: { id: "actionGroup", component: "LightBoxGalleryItem" },
      },
      Image: { className: styles.image },
    };

    const stringFormatter = useLocalizedStringFormatter(locales);

    const zoomableContent = <LightBoxZoom>{children}</LightBoxZoom>;

    return (
      <PropsContextProvider props={propsContext}>
        {withZoom ? zoomableContent : children}
        <div className={styles.actions}>
          <UiComponentTunnelExit
            id="actionGroup"
            component="LightBoxGalleryItem"
          />
          <Button
            aria-label={stringFormatter.format("close")}
            color="light-static"
            onPress={() => controller.close()}
          >
            <IconClose />
          </Button>
        </div>
      </PropsContextProvider>
    );
  },
);

export default LightBoxGalleryItem;
