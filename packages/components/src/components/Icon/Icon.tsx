import React, { FC, PropsWithChildren, SVGAttributes, useMemo } from "react";
import styles from "./Icon.module.scss";
import clsx from "clsx";
import { extractSvgFromString } from "@/components/Icon/lib/extractSvgFromString";
import { ClearPropsContext, useProps } from "@/lib/propsContext";

type SvgAttributeProps = SVGAttributes<SVGSVGElement>;

export interface IconProps
  extends PropsWithChildren<Omit<SvgAttributeProps, "name">> {
  /** @default "m" */
  size?: "s" | "m" | "l";
}

export const Icon: FC<IconProps> = (props) => {
  const {
    className,
    "aria-label": ariaLabel,
    children,
    size = "m",
    ...svgAttributes
  } = useProps("Icon", props);

  const iconProps: SvgAttributeProps = {
    ...svgAttributes,
    focusable: "false",
    role: "img",
    "aria-hidden": !ariaLabel,
    "aria-label": ariaLabel,
    className: clsx(styles.icon, className, styles[`size-${size}`]),
  };

  const isCustomSvgString = typeof children === "string";

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
};

export default Icon;
