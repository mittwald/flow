import React, { FC, PropsWithChildren } from "react";

export interface NavigationItemGroupProps extends PropsWithChildren {}

export const NavigationItemGroup: FC<NavigationItemGroupProps> = (props) => {
  const { children } = props;

  return <ul>{children}</ul>;
};

export default NavigationItemGroup;
