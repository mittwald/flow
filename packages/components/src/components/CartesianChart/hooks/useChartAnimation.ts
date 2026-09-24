import { useReducedMotion } from "framer-motion";
import { useDesignTokens } from "@/lib/theming";

/**
 * Animation props for the chart's graphical items. Recharts animates on mount
 * by default and does not look at the user's motion preference on its own.
 *
 * Replaces recharts' default `"auto"`, which means "not during SSR" – moot
 * here, since `ResponsiveContainer` renders nothing on the server.
 *
 * @internal
 */
export const useChartAnimation = () => {
  const prefersReducedMotion = useReducedMotion();
  const tokens = useDesignTokens();

  return {
    isAnimationActive: !prefersReducedMotion,
    animationDuration: parseInt(
      tokens["cartesian-chart"]["transition-duration"].value,
    ),
    // Recharts' own default, pinned to match the CSS `ease` of the DonutChart
    // and the ProgressBar.
    animationEasing: "ease" as const,
  };
};
