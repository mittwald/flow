import { propsContext } from "@/lib/propsContext/propsContext";
import { PropsContextLevelProvider } from "@/lib/propsContext/inherit/PropsContextLevelProvider";
import type { FC, PropsWithChildren } from "react";

export type ClearPropsContextProps = PropsWithChildren;

/** @flr-generate all */
export const ClearPropsContext: FC<ClearPropsContextProps> = (props) => {
  const { children } = props;
  return (
    <PropsContextLevelProvider mode="reset">
      <propsContext.Provider value={{}}>{children}</propsContext.Provider>
    </PropsContextLevelProvider>
  );
};

export default ClearPropsContext;
