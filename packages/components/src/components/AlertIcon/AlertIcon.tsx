import type { ComponentType, FC } from "react";
import {
  IconDanger,
  IconInfo,
  IconSuccess,
  IconUnavailable,
  IconWarning,
} from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import type { PropsWithStatus, Status } from "@/lib/types/props";
import type { IconProps } from "@/components/Icon";
import { SkeletonIconSurface } from "@/components/SkeletonMode/components/SkeletonIconSurface";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";

export type AlertIconProps = Omit<IconProps, "status"> & PropsWithStatus;

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

  const stringFormatter = useLocalizedStringFormatter(locales, "AlertIcon");
  const isSkeleton = useSkeletonMode();

  const Icon = icons[status];

  const iconProps: IconProps = {
    color: status,
    "aria-label": stringFormatter.format(`status.${status}`),
    ...rest,
  };

  if (isSkeleton) {
    const { className, ...iconPropsWithoutClassName } = iconProps;
    return (
      <SkeletonIconSurface className={className}>
        <Icon {...iconPropsWithoutClassName} />
      </SkeletonIconSurface>
    );
  }

  return <Icon {...iconProps} />;
};

export default AlertIcon;
