import { IconPending } from "@/components/Icon/components/icons";
import styles from "./LoadingSpinner.module.scss";
import type { IconProps } from "@/components/Icon";
import clsx from "clsx";
import { type AlphaColor, isAlphaColor } from "@/lib/types/props";
import { useReducedMotion } from "framer-motion";
import { useDesignTokens } from "@/lib/theming";
import { SkeletonIconSurface } from "@/components/SkeletonMode/components/SkeletonIconSurface";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";
import { mergeRefs } from "@react-aria/utils";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface LoadingSpinnerProps extends IconProps {
  /** The color of the loading spinner. @default "default" */
  color?: "default" | AlphaColor;
}

const globalSpinnerTime = performance.now();

/** @flr-generate all */
export const LoadingSpinner = flowComponent(
  "LoadingSpinner",
  (props) => {
    const { className, color = "default", ref, ...rest } = props;

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
          <IconPending {...rest} ref={ref} />
        </SkeletonIconSurface>
      );
    }

    return (
      <IconPending
        className={rootClassName}
        {...rest}
        ref={mergeRefs(ref, (element) => {
          if (element) {
            const elapsedMs = performance.now() - globalSpinnerTime;
            const phaseMs = elapsedMs % animationDurationMs;

            element.style.setProperty("--animation-delay", `${-phaseMs}ms`);
          }
        })}
      />
    );
  },
  /* The spinner stands in for an icon: `Icon` props contexts (e.g. the size
     `IllustratedMessage` sets) keep reaching its inner icon. */
  { type: "layout" },
);

export default LoadingSpinner;
