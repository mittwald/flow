import type { FC, PropsWithChildren } from "react";
import styles from "./Color.module.scss";

const colors = [
  "blue",
  "violet",
  "teal",
  "lilac",
  "danger",
  "warning",
  "info",
  "success",
] as const;

export type FlowColor = (typeof colors)[number];

export const flowColors: FlowColor[] = [...colors];

export interface ColorProps extends PropsWithChildren {
  /** The color of the element. @default "blue" */
  color?: FlowColor | (string & {});
}

/** @flr-generate all */
export const Color: FC<ColorProps> = (props) => {
  const { children, color = "blue" } = props;

  const isFlowColor = flowColors.includes(color as FlowColor);

  const className = isFlowColor ? styles[color as FlowColor] : undefined;
  const style = !isFlowColor ? { color } : undefined;

  return (
    <span className={className} style={style}>
      {children}
    </span>
  );
};

export default Color;
