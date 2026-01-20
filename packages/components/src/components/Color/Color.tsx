import type { FC, PropsWithChildren } from "react";
import styles from "./Color.module.scss";

const flowColors = [
  "blue",
  "violet",
  "teal",
  "lilac",
  "danger",
  "warning",
  "info",
  "success",
  "light",
  "dark",
] as const;

type FlowColor = (typeof flowColors)[number];
type FlowWithCustomColor = FlowColor | (string & {});

function isFlowColor(something: unknown): something is FlowColor {
  const anyFlowColors = flowColors as readonly string[];
  return typeof something === "string" && anyFlowColors.includes(something);
}

export interface ColorProps extends PropsWithChildren {
  /** The color of the element. @default "blue" */
  color?: FlowWithCustomColor;
}

/** @flr-generate all */
export const Color: FC<ColorProps> = (props) => {
  const { children, color = "blue" } = props;

  const isAFlowColor = isFlowColor(color);
  const className = isAFlowColor ? styles[color] : undefined;
  const style = !isAFlowColor ? { color } : undefined;

  return (
    <span className={className} style={style}>
      {children}
    </span>
  );
};

export default Color;
