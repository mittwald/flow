import { EmulatedBoldText } from "@/components/EmulatedBoldText";
import { Wrap } from "@/components/Wrap";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithElementType } from "@/lib/types/props";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import invariant from "invariant";
import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
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
  /* The alignment of the text. @default "start" */
  align?: "start" | "end" | "center";
}

/** @flr-generate all */
export const Text = flowComponent<"Text", HTMLDivElement>("Text", (props) => {
  const {
    children,
    className,
    elementType = "span",
    emulateBoldWidth,
    ref,
    color,
    align = "start",
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.text,
    color && styles[color],
    align && styles[`align-${align}`],
    className,
  );

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
    <ClearPropsContextView>
      <Aria.Text {...textProps} elementType={elementType} ref={ref}>
        {childrenElement}
      </Aria.Text>
    </ClearPropsContextView>
  );
});

export default Text;
