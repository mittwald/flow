import type { FC, PropsWithChildren } from "react";
import styles from "./Color.module.scss";
import {
  alphaColors,
  decorativeColors,
  deprecatedDecorativeColors,
  type DeprecatedDecorativeColor,
  type PropsWithClassName,
  statusTypes,
} from "@/lib/types/props";
import clsx from "clsx";
import { useDeprecatedColor } from "@/lib/hooks/useDeprecatedColor";

const flowColors = [
  ...decorativeColors,
  ...statusTypes,
  ...alphaColors,
] as const;

type FlowColor = (typeof flowColors)[number];
type FlowWithCustomColor =
  FlowColor | DeprecatedDecorativeColor | (string & {});

function isFlowColor(something: unknown): something is FlowColor {
  const anyFlowColors = flowColors as readonly string[];
  return typeof something === "string" && anyFlowColors.includes(something);
}

export interface ColorProps extends PropsWithChildren, PropsWithClassName {
  /**
   * The color of the element. @default "blue"
   *
   * @deprecatedValues violet, teal
   */
  color?: FlowWithCustomColor;
}

/** @flr-generate all */
export const Color: FC<ColorProps> = (props) => {
  const { children, className, color: colorFromProps = "blue" } = props;
  const color =
    useDeprecatedColor(colorFromProps, deprecatedDecorativeColors) ?? "blue";

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
