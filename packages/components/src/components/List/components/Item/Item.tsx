import React, { PropsWithChildren } from "react";
import styles from "./Item.module.scss";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { Wrap } from "@/components/Wrap";
import { deepHas } from "@/lib/react/deepHas";
import { Link } from "@/components/Link";
import { OptionsButton } from "@/components/List/components/OptionsButton";

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
    },
    Text: {
      className: styles.text,
    },
    Content: {
      className: styles.content,
    },
    ContextMenu: {
      placement: "bottom end",
      hoc: (el) => (
        <OptionsButton className={styles.optionsButton}>{el}</OptionsButton>
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
