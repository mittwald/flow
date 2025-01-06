import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Avatar.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import { getColorFromChildren } from "@/components/Avatar/lib/getColorFromChildren";
import type { PropsWithClassName } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { deepHas } from "@/lib/react/deepHas";
import { Initials } from "@/components/Initials";

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
}

export const Avatar = flowComponent("Avatar", (props) => {
  const { children, className, color, size = "m", refProp: ref } = props;

  const hasInitials = deepHas(children, Initials);

  const rootClassName = clsx(
    styles.avatar,
    styles[`size-${size}`],
    className,
    styles[color ?? (hasInitials ? getColorFromChildren(children) : "blue")],
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
          {children}
        </PropsContextProvider>
      </div>
    </ClearPropsContext>
  );
});

export default Avatar;
