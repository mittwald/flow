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
import { deepFindOfType } from "@/lib/react/deepFindOfType";
import { Skeleton } from "@/components/Skeleton";

export interface AvatarProps extends PropsWithChildren {
  className?: string;
  /** @default "m" */
  size?: "xs" | "s" | "m" | "l";
}

export const Avatar: FC<AvatarProps> = (props) => {
  const { children, className, size = "m" } = useProps("Avatar", props);

  const hasSkeleton = !!deepFindOfType(children, Skeleton);

  const rootClassName = clsx(
    styles.avatar,
    styles[`size-${size}`],
    className,
    styles[`variant-${getVariantFromChildren(children)}`],
    hasSkeleton && styles.skeleton,
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
      <div className={rootClassName}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </div>
    </ClearPropsContext>
  );
};

export default Avatar;
