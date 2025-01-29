import type { PropsWithChildren, ReactNode } from "react";
import React from "react";
import styles from "../../ListItemView.module.scss";
import type { PropsWithClassName } from "~/lib/types/props";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "~/lib/propsContext";

export type ListItemViewContentProps = PropsWithChildren &
  PropsWithClassName & {
    title?: ReactNode;
    subTitle?: ReactNode;
    button?: ReactNode;
  };

const getStyleForContentSlot = (slot?: string) =>
  slot === "top"
    ? styles.topContent
    : slot === "bottom"
      ? styles.bottomContent
      : styles.topContent;

/** @flr-generate all */
export const ListItemViewContent = (props: ListItemViewContentProps) => {
  const { children, className, title, subTitle, button } = props;

  const propsContext: PropsContext = {
    ContextMenu: {
      placement: "bottom end",
    },
    Button: {
      className: styles.action,
    },
    ActionGroup: {
      className: styles.action,
      ignoreBreakpoint: true,
    },
    Content: {
      className: dynamic((p) => getStyleForContentSlot(p.slot)),
    },
    Avatar: {
      className: styles.avatar,
    },
    Heading: {
      className: styles.heading,
      level: 5,
    },
    Text: {
      className: styles.text,
    },
    Link: {
      unstyled: true,
    },
  };

  return (
    <PropsContextProvider props={propsContext} mergeInParentContext>
      <div className={className}>
        <div className={styles.content}>
          {children}
          <div className={styles.title}>
            {title}
            <div className={styles.subTitle}>{subTitle}</div>
          </div>
        </div>
        {button}
      </div>
    </PropsContextProvider>
  );
};

export default ListItemViewContent;
