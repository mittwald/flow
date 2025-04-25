import type { PropsWithChildren } from "react";
import type {
  PropsWithClassName,
  PropsWithElementType,
} from "@/lib/types/props";
import clsx from "clsx";
import styles from "./AccentBox.module.scss";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsContext } from "@/lib/propsContext";

export interface AccentBoxProps
  extends PropsWithChildren,
    PropsWithElementType<"div" | "section" | "article">,
    PropsWithClassName,
    FlowComponentProps {
  color?: "blue" | "green" | "gradient" | "neutral";
}

/** @flr-generate all */
export const AccentBox = flowComponent("AccentBox", (props) => {
  const { color = "blue", children, elementType = "div", className } = props;

  const rootClassName = clsx(styles.accentBox, className, styles[color]);

  const Element = elementType;

  const contentColor = color === "green" ? "dark" : undefined;

  const propsContext: PropsContext = {
    Link: {
      color: contentColor,
    },
    Text: { color: contentColor },
    Heading: { color: contentColor },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <Element className={rootClassName}>{children}</Element>
    </PropsContextProvider>
  );
});

export default AccentBox;
