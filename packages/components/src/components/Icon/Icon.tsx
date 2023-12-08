import React, { FC, PropsWithChildren, SVGAttributes, useMemo } from "react";
import styles from "./Icon.module.css";
import { IconLookup } from "@fortawesome/fontawesome-svg-core";
import {
  BackwardCompatibleOmit,
  FontAwesomeIcon,
} from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { extractSvgFromString } from "@/components/Icon/lib/extractSvgFromString";

type SvgAttributeProps = BackwardCompatibleOmit<
  SVGAttributes<SVGSVGElement>,
  "children" | "mask" | "transform"
>;

export interface IconProps extends PropsWithChildren<SvgAttributeProps> {
  faIcon?: IconLookup;
}

export const Icon: FC<IconProps> = (props) => {
  const { faIcon, "aria-label": ariaLabel, children, ...svgAttributes } = props;

  const iconProps: SvgAttributeProps = {
    ...svgAttributes,
    className: clsx(svgAttributes.className, styles.root),
    focusable: "false",
    role: "img",
    "aria-hidden": !ariaLabel,
    "aria-label": ariaLabel,
  };

  if (faIcon) {
    return <FontAwesomeIcon icon={faIcon} {...iconProps} />;
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
