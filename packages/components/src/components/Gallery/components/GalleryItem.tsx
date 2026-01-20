import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithChildren } from "react";
import styles from "../Gallery.module.scss";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import DivView from "@/views/DivView";
import ButtonView from "@/views/ButtonView";
import { IconClose } from "@/components/Icon/components/icons";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { useOverlayController } from "@/lib/hooks";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../locales/*.locale.json";

export type GalleryItemProps = PropsWithChildren;

export const GalleryItem = flowComponent("GalleryItem", (props) => {
  const { children } = props;

  const controller = useOverlayController("Modal");

  const propsContext: PropsContext = {
    ActionGroup: {
      className: styles.actionGroup,
      Button: { color: "light" },
      tunnelId: "actionGroup",
    },
    Image: { className: styles.image },
  };

  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <PropsContextProvider props={propsContext}>
      <TunnelProvider>
        {children}
        <DivView className={styles.actions}>
          <ButtonView
            aria-label={stringFormatter.format("gallery.close")}
            color="light"
            onPress={controller.close}
          >
            <IconClose />
          </ButtonView>
          <TunnelExit id="actionGroup" />
        </DivView>
      </TunnelProvider>
    </PropsContextProvider>
  );
});
