import type { FC } from "react";
import { IconPending } from "@/components/Icon/components/icons";
import styles from "./LoadingSpinner.module.scss";
import React from "react";
import type { IconProps } from "@/components/Icon";
import clsx from "clsx";

export const LoadingSpinner: FC<IconProps> = (props) => {
  const { className, ...rest } = props;

  const rootClassName = clsx(styles.loadingSpinner, className);

  return <IconPending className={rootClassName} {...rest} />;
};

export default LoadingSpinner;
