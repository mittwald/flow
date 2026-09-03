import type { PropsWithChildren, SVGAttributes } from "react";
import React from "react";
import styles from "./Icon.module.scss";
import clsx from "clsx";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { cloneElement } from "@/lib/react/cloneElement";
import { alphaColors, type Status, statusTypes } from "@/lib/types/props";
import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";

type SvgAttributeProps = SVGAttributes<SVGSVGElement>;

const iconColors = [
  "neutral",
  "blue",
  "violet",
  "teal",
  "lilac",
  ...statusTypes,
  ...alphaColors,
] as const;

type IconColor = (typeof iconColors)[number];
type IconWithCustomColor = IconColor | (string & {});

function isIconColor(something: unknown): something is IconColor {
  const anyIconColors = iconColors as readonly string[];
  return typeof something === "string" && anyIconColors.includes(something);
}

export interface IconProps
  extends
    PropsWithChildren<Omit<SvgAttributeProps, "name" | "color">>,
    FlowComponentProps {
  /** The size of the icon. @default "m" */
  size?: "s" | "m" | "l";
  /**
   * The color of the icon. Besides the Flow colors, any custom CSS color is
   * supported. Inherits the surrounding text color when unset.
   */
  color?: IconWithCustomColor;
  /**
   * The elements status.
   *
   * @deprecated Use `color` instead.
   */
  status?: Status;
}

/** @flr-generate all */
export const Icon = flowComponent("Icon", (props) => {
  const warnDeprecation = useWarnDeprecation();
  const {
    className,
    "aria-label": ariaLabel,
    children,
    size = "m",
    status,
    color,
    ...svgAttributes
  } = props;

  if (status !== undefined) {
    warnDeprecation(
      "The 'status' prop is deprecated and will be removed in a future release. Use 'color' instead.",
    );
  }

  const resolvedColor = color ?? status;
  const paletteColor = isIconColor(resolvedColor) ? resolvedColor : undefined;
  const customColor = paletteColor === undefined ? resolvedColor : undefined;
  const customColorStyle = customColor
    ? { color: customColor, ...svgAttributes.style }
    : undefined;

  const iconProps: SvgAttributeProps = {
    ...svgAttributes,
    ...(customColorStyle && { style: customColorStyle }),
    focusable: "false",
    role: "img",
    "aria-hidden": !ariaLabel,
    "aria-label": ariaLabel,
    className: clsx(
      styles.icon,
      styles[`size-${size}`],
      paletteColor && styles[paletteColor],
      className,
    ),
  };

  const iconElement = React.Children.toArray(children)[0];

  if (!React.isValidElement(iconElement)) {
    throw new Error(
      `Expected children of Icon component to be a valid React element (got ${String(
        children,
      )})`,
    );
  }

  return cloneElement(iconElement, iconProps);
});

export default Icon;
