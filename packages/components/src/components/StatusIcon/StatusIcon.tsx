import React, { ComponentType, FC } from "react";
import {
  IconDanger,
  IconInfo,
  IconSuccess,
  IconWarning,
} from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { PropsWithStatus, Status } from "@/lib/types/props";
import { IconProps } from "@/components/Icon";
import { ClearPropsContext } from "@/lib/propsContext";

export interface StatusIconProps extends PropsWithStatus, IconProps {}

const icons: Record<Status, ComponentType> = {
  danger: IconDanger,
  info: IconInfo,
  success: IconSuccess,
  warning: IconWarning,
};

export const StatusIcon: FC<StatusIconProps> = (props) => {
  const { status = "info", ...rest } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const ariaLabel = stringFormatter.format(`statusIcon.${status}`);

  const Icon = icons[status];

  return (
    <ClearPropsContext>
      <Icon aria-label={ariaLabel} {...rest} />
    </ClearPropsContext>
  );
};

export default StatusIcon;
