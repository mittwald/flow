import type { PropsWithChildren, SVGAttributes } from "react";
import React, { useMemo } from "react";
import styles from "./Icon.module.scss";
import clsx from "clsx";
import { extractSvgFromString } from "@/components/Icon/lib/extractSvgFromString";
import { ClearPropsContext } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

type SvgAttributeProps = SVGAttributes<SVGSVGElement>;

export interface IconProps
  extends PropsWithChildren<Omit<SvgAttributeProps, "name">>,
    FlowComponentProps {
  /** @default "m" */
  size?: "s" | "m" | "l";
}

export const Icon = flowComponent("Icon", (props) => {
  const {
    className,
    "aria-label": ariaLabel,
    children,
    size = "m",
    refProp: ignoredRef,
    ...svgAttributes
  } = props;

  const iconProps: SvgAttributeProps = {
    ...svgAttributes,
    focusable: "false",
    role: "img",
    "aria-hidden": !ariaLabel,
    "aria-label": ariaLabel,

    className: clsx(
      styles.icon,
      className,
      styles[`size-${size}`],
    ),
  };

  const isCustomSvgString = typeof children === "string";

  // @warning: extractSvgFromString might be a performance-killer
  const iconElement = useMemo(
    () => (isCustomSvgString ? extractSvgFromString(children) : children),
    [isCustomSvgString, children],
  );

  if (!React.isValidElement(iconElement)) {
    throw new Error(
      `Expected children of Icon component to be a valid React element (got ${String(
        iconElement,
      )})`,
    );
  }

  return (
    <ClearPropsContext>
      {React.cloneElement(iconElement, iconProps)}
    </ClearPropsContext>
  );
});

export default Icon;
