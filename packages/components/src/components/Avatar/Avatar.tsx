import React, { FC, PropsWithChildren } from "react";
import styles from "./Avatar.module.css";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface AvatarProps extends PropsWithChildren {
  className?: string;
  /** @default "s" */
  size?: "s" | "m" | "l";
}

export const Avatar: FC<AvatarProps> = (props) => {
  const { children, className, size = "s" } = props;

  const rootClassName = clsx(className, styles.root, styles[`size-${size}`]);

  const propsContext: PropsContext = {
    Initials: {
      className: styles.initials,
    },
    Image: {
      className: styles.image,
    },
    Skeleton: {
      className: styles.skeleton,
    },
  };

  return (
    <div className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </div>
  );
};

export default Avatar;
