import React, { FC, PropsWithChildren } from "react";
import styles from "./styles.module.css";
import { IconLookup } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";

export interface IconProps extends PropsWithChildren {
  faIcon: IconLookup;
}

export const Icon: FC<IconProps> = (props) => {
  const { faIcon, children } = props;

  const className = styles.root;

  if (faIcon) {
    return <FontAwesomeIcon className={className} icon={faIcon} />;
  }

  const isCustomString = typeof children === "string";

  const iconElement = isCustomString
    ? parse(atob(children)).find((child) => child && child.type === "svg")
    : children;

  return React.cloneElement(iconElement, {
    className,
    "aria-hidden": true,
    focusable: "false",
    role: "img",
  });
};

export default Icon;
