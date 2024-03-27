import React, { PropsWithChildren } from "react";
import styles from "./Item.module.scss";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { deepFindOfType } from "@/lib/react/deepFindOfType";
import { ListItemLink } from "@/components/List/components/ListItemLink";
import { Wrap } from "@/components/Wrap";

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
    ListItemLink: {
      className: styles.listItem,
    },
  };

  const withLink = !!deepFindOfType(children, ListItemLink);

  return (
    <Wrap if={!withLink}>
      <div className={styles.listItem}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </div>
    </Wrap>
  );
};

export default Item;
