import React, { FC, PropsWithChildren } from "react";
import styles from "./Avatar.module.scss";
import clsx from "clsx";
import {
  ClearPropsContext,
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import { getVariantFromChildren } from "@/components/Avatar/lib/getVariantFromChildren";

export interface AvatarProps extends PropsWithChildren {
  className?: string;
  /** @default "m" */
  size?: "xs" | "s" | "m" | "l";
}

export const Avatar: FC<AvatarProps> = (props) => {
  const { children, className, size = "m" } = useProps("Avatar", props);

  const rootClassName = clsx(
    styles.avatar,
    styles[`size-${size}`],
    className,
    styles[`variant-${getVariantFromChildren(children)}`],
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
