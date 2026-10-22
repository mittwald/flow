import type { PropsWithChildren } from "react";
import styles from "./Avatar.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import {
  deprecatedDecorativeColors,
  type DeprecatedDecorativeColor,
  type PropsWithClassName,
  type Status,
} from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { AlertIcon } from "@/components/AlertIcon";
import type { avatarColors } from "@/components/Avatar/avatarColors";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";
import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";
import { useDeprecatedColor } from "@/lib/hooks/useDeprecatedColor";

export type AvatarColors =
  (typeof avatarColors)[number] | DeprecatedDecorativeColor | "green";

export interface AvatarProps
  extends PropsWithChildren, PropsWithClassName, FlowComponentProps {
  /** The size of the avatar. @default "m" */
  size?: "xs" | "s" | "m" | "l";
  /**
   * The color of icons and initials inside the avatar.
   *
   * @deprecatedValues violet, teal, green
   */
  color?: AvatarColors;
  /**
   * Adds status icon and color to the avatar. May only be used if the status is
   * explained by an element (like text or label) nearby.
   */
  status?: Status;
  /**
   * A descriptive label that assistive technology announces for the avatar
   * (e.g. the name of the represented person or entity). When set, the avatar
   * is exposed as a single image with this label. When omitted, the avatar is
   * treated as purely decorative and hidden from assistive technology.
   */
  label?: string;
}

/** @flr-generate all */
export const Avatar = flowComponent("Avatar", (props) => {
  const {
    children,
    className,
    color: colorFromProps,
    size = "m",
    status,
    label,
    ref,
  } = props;

  const warnDeprecation = useWarnDeprecation();
  const color = useDeprecatedColor(colorFromProps, deprecatedDecorativeColors);
  const isSkeleton = useSkeletonMode();

  // `green` keeps the success look it always had until it is removed; its
  // replacement `sage` is the brand's muted green (#3508).
  if (color === "green") {
    warnDeprecation(
      "The color 'green' is deprecated and will be removed in a future release. Use 'sage' instead.",
    );
  }

  const rootClassName = clsx(
    styles.avatar,
    styles[`size-${size}`],
    !status && styles[color ?? "navy"],
    status && styles[status],
    isSkeleton && styles.skeleton,
    className,
  );

  const useDynamicColor = color === undefined && status === undefined;

  const propsContext: PropsContext = {
    Initials: {
      className: styles.initials,
      useDynamicColor,
      "aria-hidden": true,
    },
    Icon: {
      className: styles.icon,
    },
    Image: {
      "aria-hidden": true,
    },
  };

  const isMeaningful = label !== undefined;
  const isDecorative = !isMeaningful && !status;

  /* The size does not depend on the content, and an `Image` inside would
     issue its request. */
  if (isSkeleton) {
    return <div className={rootClassName} ref={ref} aria-hidden inert />;
  }

  return (
    <div
      className={rootClassName}
      role={isMeaningful ? "img" : undefined}
      aria-label={label}
      aria-hidden={isDecorative || undefined}
      ref={ref}
    >
      <PropsContextProvider props={propsContext}>
        {!status && children}
        {status && <AlertIcon className={styles.icon} status={status} />}
      </PropsContextProvider>
    </div>
  );
});

export default Avatar;
