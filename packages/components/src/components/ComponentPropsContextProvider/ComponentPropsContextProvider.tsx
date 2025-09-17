import { PropsContextLevelProvider } from "@/lib/propsContext/inherit/PropsContextLevelProvider";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FC, PropsWithChildren } from "react";

export interface ComponentPropsContextProviderProps extends PropsWithChildren {
  componentProps?: PropsContext;
  incrementPropsContextLevel?: boolean;
}

/**
 * @flr-generate all
 * @flr-ignore-props componentProps
 */
export const ComponentPropsContextProvider: FC<
  ComponentPropsContextProviderProps
> = (props) => {
  const {
    children,
    componentProps: componentProps = {},
    incrementPropsContextLevel = true,
  } = props;

  let element = (
    <PropsContextProvider props={componentProps} resetPropsContextLevel={false}>
      {children}
    </PropsContextProvider>
  );

  if (incrementPropsContextLevel) {
    element = (
      <PropsContextLevelProvider mode="increment">
        {element}
      </PropsContextLevelProvider>
    );
  }

  return element;
};
