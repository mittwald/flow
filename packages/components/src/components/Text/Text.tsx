import type { PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithElementType } from "@/lib/types/props";
import invariant from "invariant";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { EmulatedBoldText } from "@/components/EmulatedBoldText";
import { Wrap } from "@/components/Wrap";
import clsx from "clsx";
import styles from "./Text.module.scss";

export interface TextProps
  extends
    PropsWithChildren,
    Omit<Aria.TextProps, "children" | "elementType">,
    PropsWithElementType<"span" | "div" | "p">,
    FlowComponentProps {
  /* Whether the elements width should match the width it would have with mold text. */
  emulateBoldWidth?: boolean;
  /* The color of the text. */
  color?: "default" | "light" | "dark";
  /* The alignment of the text. @default "start" */
  align?: "start" | "end" | "center";
  /* The text-wrap property of the text. @default undefined */
  wrap?: "wrap" | "balance" | "pretty";
  /* The white-space property of the text. @default undefined */
  whiteSpace?: React.CSSProperties["whiteSpace"];
  /* The word-break property of the text. @default undefined */
  wordBreak?: React.CSSProperties["wordBreak"];
}

/** @flr-generate all */
export const Text = flowComponent("Text", (props) => {
  const {
    children,
    className,
    elementType = "span",
    emulateBoldWidth,
    ref,
    color,
    align = "start",
    wrap,
    style: styleFromProps,
    whiteSpace,
    wordBreak,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.text,
    (color === "light" || color === "dark") && styles[color],
    align && styles[`align-${align}`],
    wrap && styles[`wrap-${wrap}`],
    className,
  );

  const textProps = { ...rest, className: rootClassName };

  const propsContext: PropsContext = {
    Link: {
      inline: true,
    },
    Icon: { className: styles.icon },
  };

  const style = { whiteSpace, wordBreak, ...styleFromProps };

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
      <Element style={style} {...textProps} ref={ref}>
        {childrenElement}
      </Element>
    );
  }

  invariant(
    typeof elementType === "string",
    "'elementType' in Text component must be of type string",
  );

  return (
    <Aria.Text style={style} {...textProps} elementType={elementType} ref={ref}>
      {childrenElement}
    </Aria.Text>
  );
});

export default Text;
