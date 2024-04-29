import type { FC } from "react";
import React from "react";
import {
  IconDanger,
  IconInfo,
  IconSuccess,
  IconWarning,
} from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import type { PropsWithStatus } from "@/lib/types/props";
import type { IconProps } from "@/components/Icon";
import { ClearPropsContext } from "@/lib/propsContext";
import clsx from "clsx";
import styles from "./StatusIcon.module.scss";

export interface StatusIconProps extends PropsWithStatus, IconProps {}

export const StatusIcon: FC<StatusIconProps> = (props) => {
  const { status = "info", className, ...rest } = props;

  const rootClassName = clsx(styles.statusIcon, styles[status], className);

  const stringFormatter = useLocalizedStringFormatter(locales);

  const iconProps: IconProps = {
    className: rootClassName,
    "aria-label": stringFormatter.format(`statusIcon.${status}`),
    ...rest,
  };

  return (
    <ClearPropsContext>
      {status === "info" && <IconInfo {...iconProps} />}
      {status === "warning" && <IconWarning {...iconProps} />}
      {status === "danger" && <IconDanger {...iconProps} />}
      {status === "success" && <IconSuccess {...iconProps} />}
    </ClearPropsContext>
  );
};

export default StatusIcon;
