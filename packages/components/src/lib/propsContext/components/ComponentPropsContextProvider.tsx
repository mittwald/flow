import type { PropsContext } from "@/lib/propsContext/types";
import { PropsContextProvider } from "@/lib/propsContext/components/PropsContextProvider";
import { memo, type FC, type PropsWithChildren } from "react";

export interface ComponentPropsContextProviderProps extends PropsWithChildren {
  componentProps?: PropsContext;
}

/**
 * @flr-generate all
 * @flr-ignore-props componentProps
 */
export const ComponentPropsContextProvider: FC<ComponentPropsContextProviderProps> =
  memo((props) => {
    const { children, componentProps = {} } = props;
    return (
      <PropsContextProvider props={componentProps}>
        {children}
      </PropsContextProvider>
    );
  });

ComponentPropsContextProvider.displayName = "ComponentPropsContextProvider";
