import { type FC } from "react";
import { IconPending } from "@/components/Icon/components/icons";
import styles from "./LoadingSpinner.module.scss";
import type { IconProps } from "@/components/Icon";
import clsx from "clsx";
import { type AlphaColor, isAlphaColor } from "@/lib/types/props";
import { useReducedMotion } from "framer-motion";
import { useDesignTokens } from "@/lib/theming";
import { SkeletonIconSurface } from "@/components/SkeletonMode/components/SkeletonIconSurface";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";

export interface LoadingSpinnerProps extends IconProps {
  /** The color of the loading spinner. @default "default" */
  color?: "default" | AlphaColor;
}

const globalSpinnerTime = performance.now();

/** @flr-generate all */
export const LoadingSpinner: FC<LoadingSpinnerProps> = (props) => {
  const { className, color = "default", ...rest } = props;

  const preferReducedMotion = useReducedMotion();
  const isSkeleton = useSkeletonMode();

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

  /* A round surface in the spinner's size, without the spinning. */
  if (isSkeleton) {
    return (
      <SkeletonIconSurface className={className}>
        <IconPending {...rest} />
      </SkeletonIconSurface>
    );
  }

  return (
    <IconPending
      className={rootClassName}
      ref={(element) => {
        if (element) {
          const elapsedMs = performance.now() - globalSpinnerTime;
          const phaseMs = elapsedMs % animationDurationMs;

          element.style.setProperty("--animation-delay", `${-phaseMs}ms`);
        }
      }}
      {...rest}
    />
  );
};

export default LoadingSpinner;
