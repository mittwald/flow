import React, { FC, PropsWithChildren, useMemo } from "react";
import styles from "./styles.module.css";
import { IconLookup } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { extractSvgFromString } from "@/components/Icon/lib";

export interface IconProps extends PropsWithChildren {
  faIcon?: IconLookup;
  "aria-label"?: string;
}

export const Icon: FC<IconProps> = (props) => {
  const { faIcon, "aria-label": ariaLabel, children } = props;

  const iconProps = {
    className: styles.root,
    "aria-hidden": !ariaLabel,
    "aria-label": ariaLabel,
    focusable: "false",
    role: "img",
  };

  if (faIcon) {
    return <FontAwesomeIcon icon={faIcon} {...iconProps} />;
  }

  const isCustomSvgString = typeof children === "string";

  const iconElement = useMemo(
    () => (isCustomSvgString ? extractSvgFromString(children) : children),
    [isCustomSvgString, children],
  );

  return React.cloneElement(iconElement, iconProps);
};

export default Icon;
