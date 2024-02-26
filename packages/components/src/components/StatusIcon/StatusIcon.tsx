import React, { FC } from "react";
import { Icon, IconProps } from "@/components/Icon";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { PropsWithVariant } from "@/lib/types/props";

export interface StatusIconProps extends PropsWithVariant, IconProps {}

export const StatusIcon: FC<StatusIconProps> = (props) => {
  const { variant = "info", ...rest } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const ariaLabel = stringFormatter.format(`statusIcon.${variant}`);

  return <Icon aria-label={ariaLabel} tablerIcon={variant} {...rest} />;
};

export default StatusIcon;
