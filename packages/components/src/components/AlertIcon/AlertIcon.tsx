import type { ComponentType, FC } from "react";
import {
  IconDanger,
  IconInfo,
  IconSuccess,
  IconUnavailable,
  IconWarning,
} from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import type { Status } from "@/lib/types/props";
import type { IconProps } from "@/components/Icon";

export type AlertIconProps = IconProps;

const icons: Record<Status, ComponentType> = {
  danger: IconDanger,
  info: IconInfo,
  success: IconSuccess,
  warning: IconWarning,
  unavailable: IconUnavailable,
};

/** @flr-generate all */
export const AlertIcon: FC<AlertIconProps> = (props) => {
  const { status = "info", ...rest } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const Icon = icons[status];

  const iconProps: IconProps = {
    status,
    "aria-label": stringFormatter.format(`alertIcon.${status}`),
    ...rest,
  };

  return <Icon {...iconProps} />;
};

export default AlertIcon;
