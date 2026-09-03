import type { PropsWithChildren } from "react";
import styles from "./Avatar.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName, Status } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { AlertIcon } from "@/components/AlertIcon";
import type { avatarColors } from "@/components/Avatar/avatarColors";

export type AvatarColors = (typeof avatarColors)[number];

export interface AvatarProps
  extends PropsWithChildren, PropsWithClassName, FlowComponentProps {
  /** The size of the avatar. @default "m" */
  size?: "xs" | "s" | "m" | "l";
  /** The color of icons and initials inside the avatar. */
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
  const { children, className, color, size = "m", status, label, ref } = props;

  const rootClassName = clsx(
    styles.avatar,
    styles[`size-${size}`],
    !status && styles[color ?? "blue"],
    status && styles[status],
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
