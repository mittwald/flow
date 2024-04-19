import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Avatar.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import {
  ClearPropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import { getVariantFromChildren } from "@/components/Avatar/lib/getVariantFromChildren";

export interface AvatarProps extends PropsWithChildren {
  className?: string;
  /** @default "m" */
  size?: "xs" | "s" | "m" | "l";
  variant?: 1 | 2 | 3 | 4;
}

export const Avatar: FC<AvatarProps> = (props) => {
  const {
    children,
    className,
    variant,
    size = "m",
  } = useProps("Avatar", props);

  const rootClassName = clsx(
    styles.avatar,
    styles[`size-${size}`],
    className,
    styles[`variant-${variant ?? getVariantFromChildren(children)}`],
  );

  const propsContext: PropsContext = {
    Initials: {
      className: styles.initials,
    },
    Icon: {
      className: styles.icon,
    },
    Skeleton: {
      className: styles.skeleton,
    },
  };

  return (
    <ClearPropsContext>
      <div className={rootClassName}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </div>
    </ClearPropsContext>
  );
};

export default Avatar;
