import type { FC, PropsWithChildren } from "react";
import React from "react";
import { ContextMenu } from "@mittwald/flow-react-components/ContextMenu";

export type UserMenuProps = PropsWithChildren;

export const UserMenu: FC<UserMenuProps> = (props) => {
  const { children } = props;

  return <ContextMenu>{children}</ContextMenu>;
};

export default UserMenu;
