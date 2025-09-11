import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import React from "react";
import styles from "../../ListItemView.module.scss";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import type { ListViewMode } from "@/components/List/model/types";
import clsx from "clsx";
import {
  ColumnLayout,
  type ColumnLayoutProps,
} from "@/components/ColumnLayout";

export type ListItemViewContentProps = PropsWithChildren &
  Pick<ColumnLayoutProps, "s" | "m" | "l"> & {
    title?: ReactNode;
    subTitle?: ReactNode;
    avatar?: ReactNode;
    button?: ReactNode;
    bottom?: ReactNode;
    checkbox?: ReactNode;
    viewMode?: ListViewMode;
  };

const getStyleForContentSlot = (slot?: string) =>
  slot === "top"
    ? styles.topContent
    : slot === "bottom"
      ? styles.bottomContent
      : styles.topContent;

/** @flr-generate all */
export const ListItemViewContent = (props: ListItemViewContentProps) => {
  const {
    children,
    avatar,
    title,
    subTitle,
    button,
    bottom,
    checkbox,
    viewMode,
    s,
    m,
    l,
  } = props;

  const contentProps: Record<string, ComponentProps<"div">> = {
    bottom: {
      onMouseDown: (e) => e.stopPropagation(),
      onPointerDown: (e) => e.stopPropagation(),
      className: styles.bottomContent,
    },
    top: {
      className: styles.topContent,
    },
  };

  const propsContext: PropsContext = {
    ContextMenu: {
      placement: "bottom end",
    },
    Button: {
      className: styles.action,
    },
    ActionGroup: {
      className: styles.action,
    },
    Content: {
      clearPropsContext: true,
      className: dynamic((p) => getStyleForContentSlot(p.slot)),
      onMouseDown: dynamic((p) => contentProps[p.slot ?? "top"]?.onMouseDown),
      onPointerDown: dynamic(
        (p) => contentProps[p.slot ?? "top"]?.onPointerDown,
      ),
    },
    Avatar: {
      className: styles.avatar,
    },
    Heading: {
      className: styles.heading,
      level: 5,
      Badge: { className: styles.badge },
      AlertBadge: { className: styles.badge },
    },
    Text: {
      className: styles.text,
    },
    Link: {
      unstyled: true,
    },
  };

  const className = clsx(
    styles.view,
    viewMode === "tiles" ? styles.tileView : styles.listView,
  );

  const header = (
    <div className={styles.header}>
      <div className={styles.checkboxContainer}>{checkbox}</div>
      {avatar}
      <div className={styles.title}>
        {title}
        <div className={styles.subTitle}>{subTitle}</div>
      </div>
    </div>
  );

  return (
    <PropsContextProvider props={propsContext} mergeInParentContext>
      <div className={className}>
        {viewMode === "list" && (
          <>
            <div className={styles.contentWrapper}>
              {s || m || l ? (
                <ColumnLayout
                  s={s}
                  m={m}
                  l={l}
                  className={clsx(styles.content, styles.columnLayout)}
                  mergeInParentContext
                >
                  {header}
                  {children}
                </ColumnLayout>
              ) : (
                <div className={styles.content}>
                  {header}
                  {children}
                </div>
              )}
              {button}
            </div>
            {bottom}
          </>
        )}

        {viewMode === "tiles" && (
          <>
            <div className={styles.avatarContainer}>{avatar}</div>
            <div className={styles.content}>
              <div className={styles.header}>
                <div className={styles.checkboxContainer}>{checkbox}</div>
                <div className={styles.title}>
                  {title}
                  <div className={styles.subTitle}>{subTitle}</div>
                </div>
                {button}
              </div>
              {children}
              {bottom}
            </div>
          </>
        )}
      </div>
    </PropsContextProvider>
  );
};

export default ListItemViewContent;
