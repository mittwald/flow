import React, { FC } from "react";
import styles from "./StatusIcon.module.css";
import { Icon } from "@/components/Icon";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons/faExclamationCircle";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import clsx from "clsx";

export interface StatusIconProps {
  /** @default "info" */
  variant?: "info" | "success" | "warning" | "negative";
  className?: string;
}

export const StatusIcon: FC<StatusIconProps> = (props) => {
  const { variant = "info", className } = props;

  const rootClassName = clsx(className, styles.root);

  const iconAriaLabel = useLocalizedStringFormatter(locales).format(
    `statusIcon.${variant}`,
  );

  const defaultIcon =
    variant === "info"
      ? faInfoCircle
      : variant === "success"
        ? faCheckCircle
        : faExclamationCircle;

  return (
    <Icon
      aria-label={iconAriaLabel}
      className={rootClassName}
      faIcon={defaultIcon}
    />
  );
};

export default StatusIcon;
