import type { IconProps } from "@/components/Icon";
import {
  IconDanger,
  IconInfo,
  IconSuccess,
  IconWarning,
} from "@/components/Icon/components/icons";
import type { PropsWithStatus, Status } from "@/lib/types/props";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import type { ComponentType, FC } from "react";
import { useLocalizedStringFormatter } from "react-aria";
import styles from "./AlertIcon.module.scss";
import locales from "./locales/*.locale.json";

export interface AlertIconProps extends PropsWithStatus, IconProps {}

const icons: Record<Status, ComponentType> = {
  danger: IconDanger,
  info: IconInfo,
  success: IconSuccess,
  warning: IconWarning,
};

/** @flr-generate all */
export const AlertIcon: FC<AlertIconProps> = (props) => {
  const { status = "info", className, ...rest } = props;

  const rootClassName = clsx(styles.alertIcon, styles[status], className);

  const stringFormatter = useLocalizedStringFormatter(locales);

  const Icon = icons[status];

  const iconProps: IconProps = {
    className: rootClassName,
    "aria-label": stringFormatter.format(`alertIcon.${status}`),
    ...rest,
  };

  return (
    <ClearPropsContextView>
      <Icon {...iconProps} />
    </ClearPropsContextView>
  );
};

export default AlertIcon;
