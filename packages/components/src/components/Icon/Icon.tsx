import type { PropsWithChildren, SVGAttributes } from "react";
import React from "react";
import styles from "./Icon.module.scss";
import clsx from "clsx";
import { ClearPropsContext } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { cloneElement } from "@/lib/react/cloneElement";

type SvgAttributeProps = SVGAttributes<SVGSVGElement>;

export interface IconProps
  extends PropsWithChildren<Omit<SvgAttributeProps, "name">>,
    FlowComponentProps {
  /** The size of the icon. @default "m" */
  size?: "s" | "m" | "l";
}

/** @flr-generate all */
export const Icon = flowComponent("Icon", (props) => {
  const {
    className,
    "aria-label": ariaLabel,
    children,
    size = "m",
    ref: ignoredRef,
    ...svgAttributes
  } = props;

  const iconProps: SvgAttributeProps = {
    ...svgAttributes,
    focusable: "false",
    role: "img",
    "aria-hidden": !ariaLabel,
    "aria-label": ariaLabel,
    className: clsx(styles.icon, className, styles[`size-${size}`]),
  };

  const iconElement = React.Children.toArray(children)[0];

  if (!React.isValidElement(iconElement)) {
    throw new Error(
      `Expected children of Icon component to be a valid React element (got ${String(
        children,
      )})`,
    );
  }

  return (
    <ClearPropsContext>
      {cloneElement(iconElement, iconProps)}
    </ClearPropsContext>
  );
});

export default Icon;
