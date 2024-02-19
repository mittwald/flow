import React, { FC, PropsWithChildren } from "react";
import styles from "./Avatar.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface AvatarProps extends PropsWithChildren {
  className?: string;
  /** @default "s" */
  size?: "xs" | "s" | "m" | "l";
}

export const Avatar: FC<AvatarProps> = (props) => {
  const { children, className, size = "m" } = props;

  const rootClassName = clsx(styles.avatar, styles[`size-${size}`], className);

  const propsContext: PropsContext = {
    Initials: {
      className: styles.initials,
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
