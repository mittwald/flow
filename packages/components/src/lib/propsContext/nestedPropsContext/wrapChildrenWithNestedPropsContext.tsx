import { FlowComponentName, FlowComponentProps } from "@/components/propTypes";
import { ComponentPropsContext } from "@/lib/propsContext/types";
import React, { PropsWithChildren } from "react";
import { PropsContextProvider } from "@/lib/propsContext";
import { isPropsWithChildren } from "@/lib/propsContext/nestedPropsContext/isPropsWithChildren";
import { pickPropsContext } from "@/lib/propsContext/nestedPropsContext/pickPropsContext";

export const wrapChildrenWithNestedPropsContext = <C extends FlowComponentName>(
  contextProps: ComponentPropsContext<C>,
  localProps: Partial<FlowComponentProps<C>>,
): PropsWithChildren => {
  const withWrappedChildren: PropsWithChildren = {};

  if (
    !isPropsWithChildren(localProps) ||
    typeof localProps.children !== "object"
  ) {
    return withWrappedChildren;
  }

  const nestedPropsContext = pickPropsContext(contextProps);

  return {
    children: (
      <PropsContextProvider props={nestedPropsContext}>
        {localProps.children}
      </PropsContextProvider>
    ),
  };
};

export default wrapChildrenWithNestedPropsContext;
