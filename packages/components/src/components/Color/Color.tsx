import type { PropsWithChildren } from "react";
import styles from "./Color.module.scss";
import {
  alphaColors,
  type PropsWithClassName,
  statusTypes,
} from "@/lib/types/props";
import clsx from "clsx";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

const flowColors = [
  "blue",
  "violet",
  "teal",
  "lilac",
  ...statusTypes,
  ...alphaColors,
] as const;

type FlowColor = (typeof flowColors)[number];
type FlowWithCustomColor = FlowColor | (string & {});

function isFlowColor(something: unknown): something is FlowColor {
  const anyFlowColors = flowColors as readonly string[];
  return typeof something === "string" && anyFlowColors.includes(something);
}

export interface ColorProps
  extends
    PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps<HTMLSpanElement> {
  /** The color of the element. @default "blue" */
  color?: FlowWithCustomColor;
}

/** @flr-generate all */
export const Color = flowComponent(
  "Color",
  (props) => {
    const { children, className, color = "blue", ref } = props;

    const isAFlowColor = isFlowColor(color);
    const rootClassName = clsx(isAFlowColor && styles[color], className);
    const style = !isAFlowColor ? { color } : undefined;

    return (
      <span ref={ref} className={rootClassName} style={style}>
        {children}
      </span>
    );
  },
  /* Outer props contexts (e.g. the content color of `AccentBox`) must not
     override the color of the content. */
  { type: "ui" },
);

export default Color;
