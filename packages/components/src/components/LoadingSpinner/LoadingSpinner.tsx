import { type FC } from "react";
import React from "react";
import { IconPending } from "@/components/Icon/components/icons";
import styles from "./LoadingSpinner.module.scss";
import type { IconProps } from "@/components/Icon";
import clsx from "clsx";
import { type AlphaColor, isAlphaColor } from "@/lib/types/props";
import { useReducedMotion } from "framer-motion";
import { useDesignTokens } from "@/lib/theming";

export interface LoadingSpinnerProps extends IconProps {
  /** The color of the loading spinner. @default "default" */
  color?: "default" | AlphaColor;
}

/** @flr-generate all */
export const LoadingSpinner: FC<LoadingSpinnerProps> = (props) => {
  const { className, color = "default", ...rest } = props;

  const preferReducedMotion = useReducedMotion();

  const designTokens = useDesignTokens();
  const loadingSpinnerTokens = designTokens["loading-spinner"];

  const animationDurationMs = preferReducedMotion
    ? parseInt(loadingSpinnerTokens["transition-duration-slow"].value)
    : parseInt(loadingSpinnerTokens["transition-duration"].value);

  const rootClassName = clsx(
    styles.loadingSpinner,
    isAlphaColor(color) && styles[color],
    className,
  );

  const startingRotation = (performance.now() / animationDurationMs) * 360;

  return (
    <IconPending
      className={rootClassName}
      style={
        {
          "--from-angle": `${startingRotation}deg`,
        } as React.CSSProperties
      }
      {...rest}
    />
  );
};

export default LoadingSpinner;
