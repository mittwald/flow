import React, {
  FC,
  PropsWithChildren,
  ReactElement,
  SVGAttributes,
  useMemo,
} from "react";
import styles from "./Icon.module.scss";
import clsx from "clsx";
import { extractSvgFromString } from "@/components/Icon/lib/extractSvgFromString";
import { useProps } from "@/lib/propsContext";
import {
  getIconByAlias,
  IconAliases,
} from "@/components/Icon/lib/getIconAlias";

type SvgAttributeProps = SVGAttributes<SVGSVGElement>;

export interface IconProps extends PropsWithChildren<SvgAttributeProps> {
  tablerIcon?: ReactElement | IconAliases;
  /** @default "m" */
  size?: "s" | "m" | "l";
}

export const Icon: FC<IconProps> = (props) => {
  const {
    tablerIcon,
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

  if (tablerIcon) {
    return React.cloneElement(
      typeof tablerIcon === "string" ? getIconByAlias(tablerIcon) : tablerIcon,
      {
        size: size === "s" ? 16 : size === "m" ? 24 : 64,
        ...iconProps,
      },
    );
  }

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

  return React.cloneElement(iconElement, iconProps);
};

export default Icon;
