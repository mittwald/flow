import { propsContext } from "@/lib/propsContext/propsContext";
import type { FC, PropsWithChildren } from "react";

export type ClearPropsContextProps = PropsWithChildren;

/** @flr-generate all */
export const ClearPropsContext: FC<ClearPropsContextProps> = (props) => {
  const { children } = props;
  return <propsContext.Provider value={{}}>{children}</propsContext.Provider>;
};

export default ClearPropsContext;
