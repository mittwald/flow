import React, { FC, PropsWithChildren } from "react";
import { propsContext } from "./propsContext";

export interface ClearPropsContextProps extends PropsWithChildren {}

export const ClearPropsContext: FC<ClearPropsContextProps> = (props) => {
  const { children } = props;

  return <propsContext.Provider value={{}}>{children}</propsContext.Provider>;
};

export default ClearPropsContext;
