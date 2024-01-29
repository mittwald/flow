import React, { FC } from "react";
import { Icon } from "@/components/Icon";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons/faExclamationCircle";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { StatusVariantProps } from "@/lib/types/props";

export interface StatusIconProps extends StatusVariantProps {
  className?: string;
}

export const StatusIcon: FC<StatusIconProps> = (props) => {
  const { variant = "info", ...rest } = props;

  const ariaLabel = useLocalizedStringFormatter(locales).format(
    `statusIcon.${variant}`,
  );

  const icon =
    variant === "info"
      ? faInfoCircle
      : variant === "success"
        ? faCheckCircle
        : faExclamationCircle;

  return <Icon aria-label={ariaLabel} faIcon={icon} {...rest} />;
};

export default StatusIcon;
