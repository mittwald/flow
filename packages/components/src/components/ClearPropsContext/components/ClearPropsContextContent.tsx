import { propsContext } from "@/lib/propsContext/propsContext";
import type { FC, PropsWithChildren } from "react";

export type ClearPropsContextContentProps = PropsWithChildren;

/** @flr-generate all */
export const ClearPropsContextContent: FC<ClearPropsContextContentProps> = (
  props,
) => {
  const { children } = props;
  return <propsContext.Provider value={{}}>{children}</propsContext.Provider>;
};

export default ClearPropsContextContent;
