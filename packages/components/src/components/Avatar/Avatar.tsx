import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Avatar.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";
import { getColorFromChildren } from "@/components/Avatar/lib/getColorFromChildren";
import type { PropsWithClassName, Status } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { AlertIcon } from "@/components/AlertIcon";

export const avatarColors = [
  "blue",
  "teal",
  "green",
  "violet",
  "lilac",
] as const;
export type AvatarColors = (typeof avatarColors)[number];

export interface AvatarProps
  extends PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps {
  /** The size of the avatar. @default "m" */
  size?: "xs" | "s" | "m" | "l";
  /** The color of icons and initials inside the avatar. */
  color?: AvatarColors;
  /**
   * Adds status icon and color to the avatar. May only be used if the status is
   * explained by an element (like text or label) nearby.
   */
  status?: Status;
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const Avatar = flowComponent<"Avatar", HTMLDivElement>(
  "Avatar",
  (props) => {
    const { children, className, color, size = "m", status, ref } = props;

    const rootClassName = clsx(
      styles.avatar,
      styles[`size-${size}`],
      className,
      !status && styles[color ?? "blue"],
      status && styles[status],
      !color && styles[`dynamic-${getColorFromChildren(children)}`],
    );

    const propsContext: PropsContext = {
      Initials: {
        className: styles.initials,
      },
      Icon: {
        className: styles.icon,
      },
    };

    return (
      <ClearPropsContext>
        <div className={rootClassName} ref={ref}>
          <PropsContextProvider props={propsContext}>
            {!status && children}
            {status && <AlertIcon className={styles.icon} status={status} />}
          </PropsContextProvider>
        </div>
      </ClearPropsContext>
    );
  },
);

export default Avatar;
