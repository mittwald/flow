import type { FC, PropsWithChildren } from "react";
import React from "react";
import { ContextMenu } from "@mittwald/flow-react-components/ContextMenu";
import type { PropsContext } from "@mittwald/flow-react-components/PropsContext";
import PropsContextProvider from "@mittwald/flow-react-components/PropsContextProvider";
import styles from "./UserMenu.module.scss";
import type { PropsWithClassName } from "@mittwald/flow-react-components/props";
import clsx from "clsx";

export type UserMenuProps = PropsWithChildren & PropsWithClassName;

export const UserMenu: FC<UserMenuProps> = (props) => {
  const { children, className } = props;

  const rootClassName = clsx(styles.contextMenu, className);

  const propsContext: PropsContext = {
    ContextMenu: {
      MenuItem: {
        className: styles.menuItem,
        Avatar: { size: "l", className: styles.avatar },
      },
      Heading: { level: 4, className: styles.heading },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <ContextMenu className={rootClassName}>{children}</ContextMenu>
    </PropsContextProvider>
  );
};

export default UserMenu;
