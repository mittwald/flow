import React, { FC, PropsWithChildren } from "react";
import styles from "./AvatarIcon.module.scss";
import clsx from "clsx";

export interface AvatarIconProps extends PropsWithChildren {
  variant?: 1 | 2 | 3 | 4;
}

export const AvatarIcon: FC<AvatarIconProps> = (props) => {
  const { children, variant = 1 } = props;

  const rootClassName = clsx(styles.avatarIcon, styles[`variant-${variant}`]);

  return <div className={rootClassName}>{children}</div>;
};

export default AvatarIcon;
