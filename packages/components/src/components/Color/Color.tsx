import type { FC, PropsWithChildren } from "react";
import styles from "./Color.module.scss";
import {
  alphaColors,
  type PropsWithClassName,
  statusTypes,
} from "@/lib/types/props";
import clsx from "clsx";

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

export interface ColorProps extends PropsWithChildren, PropsWithClassName {
  /** The color of the element. @default "blue" */
  color?: FlowWithCustomColor;
}

/** @flr-generate all */
export const Color: FC<ColorProps> = (props) => {
  const { children, className, color = "blue" } = props;

  const isAFlowColor = isFlowColor(color);
  const rootClassName = clsx(isAFlowColor && styles[color], className);
  const style = !isAFlowColor ? { color } : undefined;

  return (
    <span className={rootClassName} style={style}>
      {children}
    </span>
  );
};

export default Color;
