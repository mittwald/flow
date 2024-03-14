import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import { PropsWithElementType } from "@/lib/types/props";

export interface TextProps
  extends PropsWithChildren,
    Omit<Aria.TextProps, "children" | "elementType">,
    PropsWithElementType {}

export const Text: FC<TextProps> = (props) => {
  const {
    children,
    className,
    elementType = "span",
    ...rest
  } = useProps("Text", props);

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

  return (
    <Aria.Text {...textProps} elementType={elementType}>
      {childrenElement}
    </Aria.Text>
  );
};

export default Text;
