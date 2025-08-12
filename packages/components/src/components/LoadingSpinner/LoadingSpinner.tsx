import type { FC } from "react";
import React from "react";
import { IconPending } from "@/components/Icon/components/icons";
import styles from "./LoadingSpinner.module.scss";
import type { IconProps } from "@/components/Icon";
import clsx from "clsx";

export interface LoadingSpinnerProps extends IconProps {
  /** The color of the loading spinner. @default "default" */
  color?: "default" | "dark" | "light";
}

/** @flr-generate all */
export const LoadingSpinner: FC<LoadingSpinnerProps> = (props) => {
  const { className, color = "default", ...rest } = props;

  const rootClassName = clsx(
    styles.loadingSpinner,
    color !== "default" && styles[color],
    className,
  );

  return <IconPending className={rootClassName} {...rest} />;
};

export default LoadingSpinner;
