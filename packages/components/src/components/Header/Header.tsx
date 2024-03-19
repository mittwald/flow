import React, { FC, PropsWithChildren } from "react";
import { useProps } from "@/lib/propsContext";
import { PropsWithElementType } from "@/lib/types/props";

export interface HeaderProps extends PropsWithChildren, PropsWithElementType {}

export const Header: FC<HeaderProps> = (props) => {
  const {
    children,
    elementType = "header",
    ...rest
  } = useProps("Header", props);

  const Element = elementType;

  return <Element {...rest}>{children}</Element>;
};

export default Header;
