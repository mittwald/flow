import React, { FC, HTMLAttributes, PropsWithChildren } from "react";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import styles from "./Banner.module.css";
import clsx from "clsx";

export interface BannerProps
  extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
  severity?: "danger" | "warning" | "info";
}

export const Banner: FC<BannerProps> = (props) => {
  const {
    children,
    className,
    severity = "info",
    ...rest
  } = useProps("banner", props);

  const rootClassName = clsx(className, styles.root, styles[severity]);

  const propsContext: PropsContext = {
    icon: {
      className: styles.icon,
    },
    heading: {
      className: styles.heading,
    },
    content: {
      className: styles.content,
    },
  };

  return (
    <aside {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </aside>
  );
};

export default Banner;
