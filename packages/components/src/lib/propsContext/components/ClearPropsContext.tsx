import { PropsContextProvider } from "@/lib/propsContext/propsContext";
import { type FC, type PropsWithChildren } from "react";

export type ClearPropsContextProps = PropsWithChildren;

/** @flr-generate all */
export const ClearPropsContext: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return <PropsContextProvider value={{}}>{children}</PropsContextProvider>;
};

export default ClearPropsContext;
