import React, { FC } from "react";
import styles from "./StatusIcon.module.css";
import { Icon } from "@/components/Icon";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons/faExclamationCircle";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import clsx from "clsx";
import { StatusVariantProps } from "@/lib/types/props";

export interface StatusIconProps extends StatusVariantProps {
  className?: string;
}

export const StatusIcon: FC<StatusIconProps> = (props) => {
  const { variant = "info", className } = props;
  const stringFormatter = useLocalizedStringFormatter(locales);

  const rootClassName = clsx(className, styles.root);

  const ariaLabel = stringFormatter.format(`statusIcon.${variant}`);

  const icon =
    variant === "info"
      ? faInfoCircle
      : variant === "success"
        ? faCheckCircle
        : faExclamationCircle;

  return (
    <Icon aria-label={ariaLabel} className={rootClassName} faIcon={icon} />
  );
};

export default StatusIcon;
