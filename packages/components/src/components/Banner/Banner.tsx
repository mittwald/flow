import React, { FC, HTMLAttributes, PropsWithChildren } from "react";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import styles from "./Banner.module.css";
import clsx from "clsx";
import { Icon } from "@/components/Icon";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

// ToDo: warning oder notice?
export interface BannerProps
  extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
  variant?: "info" | "warning" | "negative";
}

export const Banner: FC<BannerProps> = (props) => {
  const {
    children,
    className,
    variant = "info",
    ...rest
  } = useProps("banner", props);

  const rootClassName = clsx(className, styles.root, styles[variant]);

  // ToDo: Labels übersetzen?
  const iconAriaLabel =
    variant === "info" ? "Info" : variant === "warning" ? "Warning" : "Error";

  const propsContext: PropsContext = {
    icon: {
      className: styles.customIcon,
      "aria-label": iconAriaLabel,
    },
    heading: {
      className: styles.heading,
      level: 3,
    },
    content: {
      className: styles.content,
    },
  };

  const defaultIcon = variant === "info" ? faInfoCircle : faExclamationCircle;

  return (
    <aside {...rest} className={rootClassName}>
      <Icon
        className={styles.defaultIcon}
        aria-label={iconAriaLabel}
        faIcon={defaultIcon}
      />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </aside>
  );
};

export default Banner;
