import React, { FC, PropsWithChildren } from "react";
import styles from "./styles.module.css";
import { IconLookup } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";

export interface IconProps extends PropsWithChildren {
  faIcon?: IconLookup;
  faAnimation?: "bounce" | "spin" | "shake" | "beat";
  "aria-label"?: string;
}

export const Icon: FC<IconProps> = (props) => {
  const { faIcon, faAnimation, "aria-label": ariaLabel, children } = props;

  const className = styles.root;

  if (faIcon) {
    return (
      <FontAwesomeIcon
        bounce={faAnimation === "bounce"}
        spin={faAnimation === "spin"}
        shake={faAnimation === "shake"}
        beat={faAnimation === "beat"}
        className={className}
        icon={faIcon}
        aria-label={ariaLabel}
        aria-hidden={!ariaLabel}
      />
    );
  }

  const isCustomString = typeof children === "string";

  const iconElement = isCustomString
    ? parse(atob(children)).find((child) => child && child.type === "svg")
    : children;

  return React.cloneElement(iconElement, {
    className,
    "aria-hidden": !ariaLabel,
    "aria-label": ariaLabel,
    focusable: "false",
    role: "img",
  });
};

export default Icon;
