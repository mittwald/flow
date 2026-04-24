import { flowComponent } from "@/lib/componentFactory/flowComponent";
import styles from "@/components/LightBox/components/LightBoxGallery/LightBoxGallery.module.scss";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { IconClose } from "@/components/Icon/components/icons";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { useOverlayController } from "@/lib/hooks";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../locales/*.locale.json";
import { Button } from "@/components/Button";
import type { PropsWithChildren } from "react";

export type LightBoxGalleryItemProps = PropsWithChildren;

/** @flr-generate all */
export const LightBoxGalleryItem = flowComponent(
  "LightBoxGalleryItem",
  (props) => {
    const { children } = props;

    const controller = useOverlayController("Modal");

    const propsContext: PropsContext = {
      ActionGroup: {
        className: styles.actionGroup,
        Button: { color: "light-static" },
        tunnelId: "actionGroup",
      },
      Image: { className: styles.image },
    };

    const stringFormatter = useLocalizedStringFormatter(locales);

    return (
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          {children}
          <div className={styles.actions}>
            <Button
              aria-label={stringFormatter.format("close")}
              color="light-static"
              onPress={() => controller.close()}
            >
              <IconClose />
            </Button>
            <TunnelExit id="actionGroup" />
          </div>
        </TunnelProvider>
      </PropsContextProvider>
    );
  },
);
