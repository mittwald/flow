import React, {
  ComponentProps,
  FC,
  PropsWithChildren,
  SVGAttributes,
  useMemo,
} from "react";
import styles from "./Icon.module.css";
import { IconLookup } from "@fortawesome/fontawesome-svg-core";
import {
  BackwardCompatibleOmit,
  FontAwesomeIcon,
} from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { extractSvgFromString } from "@/components/Icon/lib/extractSvgFromString";
import { useProps } from "@/lib/propsContext";

type SvgAttributeProps = BackwardCompatibleOmit<
  SVGAttributes<SVGSVGElement>,
  "children" | "mask" | "transform"
>;

export interface IconProps extends PropsWithChildren<SvgAttributeProps> {
  faIcon?: IconLookup;
}

export const Icon: FC<IconProps> = (props) => {
  const {
    faIcon,
    className: classNameFromProps,
    "aria-label": ariaLabel,
    children,
    ...svgAttributes
  } = useProps("Icon", props);

  const iconProps: SvgAttributeProps = {
    ...svgAttributes,
    className: styles.icon,
    focusable: "false",
    role: "img",
    "aria-hidden": !ariaLabel,
    "aria-label": ariaLabel,
  };

  /**
   * Icon is wrapped inside span, so it always behaves as an inline element
   * (line-height is applied), even if used in flex/grid layouts.
   */
  const spanProps: ComponentProps<"span"> = {
    className: clsx(classNameFromProps, styles.root),
  };

  if (faIcon) {
    return (
      <span {...spanProps}>
        <FontAwesomeIcon icon={faIcon} {...iconProps} />
      </span>
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

  return (
    <span {...spanProps}>{React.cloneElement(iconElement, iconProps)}</span>
  );
};

export default Icon;
