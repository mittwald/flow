import React, { FC, PropsWithChildren } from "react";
import styles from "./Avatar.module.css";
import clsx from "clsx";

interface AvatarProps extends PropsWithChildren {
  className?: string;
  /** @default "s" */
  size?: "s" | "m" | "l";
}

export const Avatar: FC<AvatarProps> = (props) => {
  const { children, className, size = "s" } = props;

  const rootClassName = clsx(className, styles.root, styles[`size-${size}`]);

  return <div className={rootClassName}>{children}</div>;
};

export default Avatar;
