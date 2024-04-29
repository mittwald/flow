import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Item.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { Wrap } from "@/components/Wrap";
import { deepHas } from "@/lib/react/deepHas";
import { Link } from "@/components/Link";
import { OptionsButton } from "@/components/List/components/Items/OptionsButton";

interface Props extends PropsWithChildren {}

export const Item = (props: Props) => {
  const { children } = props;

  const hasLink = deepHas(children, Link);

  const mainPropsContext: PropsContext = {
    Avatar: {
      className: styles.avatar,
    },
    Heading: {
      className: styles.heading,
      level: 3,
    },
    Text: {
      className: styles.text,
    },
    StatusBadge: {
      className: styles.statusBadge,
    },
    Content: {
      className: styles.content,
    },
    ContextMenu: {
      render: (ContextMenu, props) => (
        <OptionsButton className={styles.optionsButton}>
          <ContextMenu {...props} placement="bottom end" />
        </OptionsButton>
      ),
    },
  };

  const propsContext: PropsContext = {
    ...mainPropsContext,
    Link: {
      className: styles.item,
      unstyled: true,
      ...mainPropsContext,
    },
  };

  return (
    <Wrap if={!hasLink}>
      <div className={styles.item}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </div>
    </Wrap>
  );
};

export default Item;
