import React, { FC, PropsWithChildren } from "react";
import { ClearPropsContext, useProps } from "@/lib/propsContext";
import { PropsWithElementType } from "@/lib/types/props";

export interface HeaderProps extends PropsWithChildren, PropsWithElementType {}

export const Header: FC<HeaderProps> = (props) => {
  const {
    children,
    elementType = "header",
    ...rest
  } = useProps("Header", props);

  const Element = elementType;

  return (
    <ClearPropsContext>
      <Element {...rest}>{children}</Element>
    </ClearPropsContext>
  );
};

export default Header;
