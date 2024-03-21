import { FlowComponentName, FlowComponentProps } from "@/components/propTypes";
import { ComponentPropsContext } from "@/lib/propsContext/types";
import React, { isValidElement, PropsWithChildren } from "react";
import { isPropsWithChildren } from "@/lib/propsContext/nestedPropsContext/isPropsWithChildren";
import { pickPropsContext } from "@/lib/propsContext/nestedPropsContext/pickPropsContext";
import PropsContextProvider from "@/lib/propsContext/PropsContextProvider";

export const wrapChildrenWithNestedPropsContext = <C extends FlowComponentName>(
  contextProps: ComponentPropsContext<C>,
  localProps: Partial<FlowComponentProps<C>>,
): PropsWithChildren => {
  if (!isPropsWithChildren(localProps)) {
    return {};
  }

  const childrenProp = localProps.children;

  if (!Array.isArray(childrenProp) && !isValidElement(childrenProp)) {
    return {};
  }

  const nestedPropsContext = pickPropsContext(contextProps);

  const isNestedPropsContextEmpty =
    Object.keys(nestedPropsContext).length === 0;

  if (isNestedPropsContextEmpty) {
    return {};
  }

  return {
    children: (
      <PropsContextProvider props={nestedPropsContext}>
        {localProps.children}
      </PropsContextProvider>
    ),
  };
};

export default wrapChildrenWithNestedPropsContext;
