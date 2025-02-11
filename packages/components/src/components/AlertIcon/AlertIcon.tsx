import type { ComponentType, FC } from "react";
import React from "react";
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
import clsx from "clsx";
import styles from "./AlertIcon.module.scss";

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
    <ClearPropsContext>
      <Icon {...iconProps} />
    </ClearPropsContext>
  );
};

export default AlertIcon;
