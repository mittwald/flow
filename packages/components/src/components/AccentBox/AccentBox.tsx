import type { PropsWithChildren } from "react";
import type {
  PropsWithClassName,
  PropsWithElementType,
} from "@/lib/types/props";
import clsx from "clsx";
import styles from "./AccentBox.module.scss";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface AccentBoxProps
  extends PropsWithChildren,
    PropsWithElementType<"div" | "section" | "article">,
    PropsWithClassName,
    FlowComponentProps {
  color?: "blue" | "gradient";
}

/** @flr-generate all */
export const AccentBox = flowComponent("AccentBox", (props) => {
  const { color = "blue", children, elementType = "div", className } = props;

  const rootClassName = clsx(styles.accentBox, className, styles[color]);

  const Element = elementType;

  return <Element className={rootClassName}>{children}</Element>;
});

export default AccentBox;
