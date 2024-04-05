import type { PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithElementType } from "@/lib/types/props";
import invariant from "invariant";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface TextProps
  extends PropsWithChildren,
    Omit<Aria.TextProps, "children" | "elementType">,
    PropsWithElementType,
    FlowComponentProps {}

export const Text = flowComponent("Text", (props) => {
  const { children, className, elementType = "span", ...rest } = props;

  const textProps = { ...rest, className };

  const propsContext: PropsContext = {
    Link: {
      inline: true,
    },
  };

  const childrenElement = (
    <PropsContextProvider props={propsContext}>{children}</PropsContextProvider>
  );

  if (!props.slot) {
    const Element = elementType;
    return <Element {...textProps}>{childrenElement}</Element>;
  }

  invariant(
    typeof elementType === "string",
    "'elementType' in Text component must be of type string",
  );

  return (
    <ClearPropsContext>
      <Aria.Text {...textProps} elementType={elementType}>
        {childrenElement}
      </Aria.Text>
    </ClearPropsContext>
  );
});

export default Text;
