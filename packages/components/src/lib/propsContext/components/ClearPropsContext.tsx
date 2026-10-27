import { PropsContextProvider } from "@/lib/propsContext/propsContext";
import { type FC, type PropsWithChildren } from "react";

export type ClearPropsContextProps = PropsWithChildren;

const emptyPropsContext = {};

/** @flr-generate all */
export const ClearPropsContext: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return (
    <PropsContextProvider value={emptyPropsContext}>
      {children}
    </PropsContextProvider>
  );
};

export default ClearPropsContext;
