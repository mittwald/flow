import type { ComponentType, FC } from "react";
import {
  IconDanger,
  IconInfo,
  IconSuccess,
  IconWarning,
} from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import type { PropsWithStatus, Status } from "@/lib/types/props";
import type { IconProps } from "@/components/Icon";
import { ClearPropsContext } from "@/lib/propsContext";

export interface AlertIconProps extends PropsWithStatus, IconProps {}

const icons: Record<Status, ComponentType> = {
  danger: IconDanger,
  info: IconInfo,
  success: IconSuccess,
  warning: IconWarning,
};

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const AlertIcon: FC<AlertIconProps> = (props) => {
  const { status = "info", ...rest } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const Icon = icons[status];

  const iconProps: IconProps = {
    status,
    "aria-label": stringFormatter.format(`alertIcon.${status}`),
    ...rest,
  };

  return (
    <ClearPropsContext>
      <Icon {...iconProps} />
    </ClearPropsContext>
  );
};

export default AlertIcon;
