import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FC, PropsWithChildren } from "react";
import type { PropsContextLevelMode } from "@/lib/propsContext/inherit/types";

export interface ComponentPropsContextProviderProps extends PropsWithChildren {
  componentProps?: PropsContext;
  levelModel?: PropsContextLevelMode;
}

/**
 * @flr-generate all
 * @flr-ignore-props componentProps
 */
export const ComponentPropsContextProvider: FC<
  ComponentPropsContextProviderProps
> = (props) => {
  const { children, componentProps = {}, levelModel = "increment" } = props;

  return (
    <PropsContextProvider props={componentProps} levelMode={levelModel}>
      {children}
    </PropsContextProvider>
  );
};
