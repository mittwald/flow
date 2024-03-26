import React, { PropsWithChildren } from "react";
import styles from "./Item.module.css";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

interface Props extends PropsWithChildren {}

export const Item = (props: Props) => {
  const { children } = props;

  const propsContext: PropsContext = {
    Avatar: {
      className: styles.avatar,
    },
    Heading: {
      className: styles.heading,
    },
    Text: {
      className: styles.text,
    },
    Content: {
      className: styles.content,
    },
    ListItemContextMenu: {
      className: styles.contextMenu,
    },
  };

  return (
    <div className={styles.listItem}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </div>
  );
};

export default Item;
