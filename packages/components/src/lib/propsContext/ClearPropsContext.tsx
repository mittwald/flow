import type { FC, PropsWithChildren } from "react";
import React from "react";
import { propsContext } from "@/lib/propsContext/propsContext";

export type ClearPropsContextProps = PropsWithChildren;

export const ClearPropsContext: FC<ClearPropsContextProps> = (props) => {
  const { children } = props;
  return <propsContext.Provider value={{}}>{children}</propsContext.Provider>;
};

export default ClearPropsContext;
