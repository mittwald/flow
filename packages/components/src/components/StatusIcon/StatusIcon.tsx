import React, { ComponentType, FC } from "react";
import {
  IconDanger,
  IconInfo,
  IconSuccess,
  IconWarning,
} from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { PropsWithVariant, Variant } from "@/lib/types/props";
import { IconProps } from "@/components/Icon";

export interface StatusIconProps extends PropsWithVariant, IconProps {}

const icons: Record<Variant, ComponentType> = {
  danger: IconDanger,
  info: IconInfo,
  success: IconSuccess,
  warning: IconWarning,
};

export const StatusIcon: FC<StatusIconProps> = (props) => {
  const { variant = "info", ...rest } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const ariaLabel = stringFormatter.format(`statusIcon.${variant}`);

  const Icon = icons[variant];

  return <Icon aria-label={ariaLabel} {...rest} />;
};

export default StatusIcon;
