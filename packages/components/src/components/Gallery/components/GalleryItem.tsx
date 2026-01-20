import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithChildren } from "react";
import styles from "./GalleryItem.module.scss";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";

export type GalleryItemProps = PropsWithChildren;

export const GalleryItem = flowComponent("GalleryItem", (props) => {
  const { children } = props;

  const propsContext: PropsContext = {
    ActionGroup: {
      className: styles.actionGroup,
      Button: { color: "light" },
    },
  };

  return (
    <div className={styles.galleryItem}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </div>
  );
});
