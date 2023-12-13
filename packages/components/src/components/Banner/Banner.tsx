import React, { FC, HTMLAttributes, PropsWithChildren } from "react";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import styles from "./Banner.module.css";
import clsx from "clsx";
import { Icon } from "@/components/Icon";
import { faCircle } from "@fortawesome/free-regular-svg-icons/faCircle";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons/faCircleQuestion";
import { faFaceMeh } from "@fortawesome/free-regular-svg-icons/faFaceMeh";
import { faFaceSadTear } from "@fortawesome/free-regular-svg-icons/faFaceSadTear";
import { faFaceSmile } from "@fortawesome/free-regular-svg-icons/faFaceSmile";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { faWarning } from "@fortawesome/free-solid-svg-icons/faWarning";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

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
      className: styles.customIcon,
    },
    heading: {
      className: styles.heading,
      level: 3,
    },
    content: {
      className: styles.content,
    },
  };

  return (
    <aside {...rest} className={rootClassName}>
      <Icon
        className={styles.defaultIcon}
        faIcon={severity === "info" ? faInfoCircle : faExclamationCircle}
      />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </aside>
  );
};

export default Banner;
