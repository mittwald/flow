import type { PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithElementType } from "@/lib/types/props";
import invariant from "invariant";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { EmulatedBoldText } from "@/components/EmulatedBoldText";
import { Wrap } from "@/components/Wrap";
import clsx from "clsx";
import styles from "./Text.module.scss";

export interface TextProps
  extends PropsWithChildren,
    Omit<Aria.TextProps, "children" | "elementType">,
    PropsWithElementType<"span" | "div" | "p">,
    FlowComponentProps {
  /* Whether the elements width should match the width it would have with mold text. */
  emulateBoldWidth?: boolean;
  /* The color of the text. */
  color?: "light" | "dark";
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const Text = flowComponent<"Text", HTMLDivElement>("Text", (props) => {
  const {
    children,
    className,
    elementType = "span",
    emulateBoldWidth,
    ref,
    color,
    ...rest
  } = props;

  const rootClassName = clsx(styles.text, color && styles[color], className);

  const textProps = { ...rest, className: rootClassName };

  const propsContext: PropsContext = {
    Link: {
      inline: true,
    },
  };

  const childrenElement = (
    <PropsContextProvider props={propsContext}>
      <Wrap if={emulateBoldWidth}>
        <EmulatedBoldText>{children}</EmulatedBoldText>
      </Wrap>
    </PropsContextProvider>
  );

  if (!props.slot) {
    const Element = elementType;
    return (
      <Element {...textProps} ref={ref}>
        {childrenElement}
      </Element>
    );
  }

  invariant(
    typeof elementType === "string",
    "'elementType' in Text component must be of type string",
  );

  return (
    <ClearPropsContext>
      <Aria.Text {...textProps} elementType={elementType} ref={ref}>
        {childrenElement}
      </Aria.Text>
    </ClearPropsContext>
  );
});

export default Text;
