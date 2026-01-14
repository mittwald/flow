import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { CSSProperties, PropsWithChildren } from "react";
import styles from "./GalleryItem.module.scss";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface GalleryItemProps extends PropsWithChildren {
  /** @internal */
  height?: CSSProperties["height"];
}

export const GalleryItem = flowComponent("GalleryItem", (props) => {
  const { children, height } = props;

  const propsContext: PropsContext = {
    ActionGroup: {
      className: styles.actionGroup,
    },
  };

  return (
    <div style={{ height }} className={styles.galleryItem}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </div>
  );
});
