import type { PropsWithElementType } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./CounterBadge.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";

export interface CounterBadgeProps
  extends PropsWithElementType<"span">, FlowComponentProps {
  /** The number displayed inside the badge. */
  count?: number;
}

/** @flr-generate all */
export const CounterBadge = flowComponent("CounterBadge", (props) => {
  const { className, count, ref, ...rest } = props;

  const isSkeleton = useSkeletonMode();

  const rootClassName = clsx(
    styles.counterBadge,
    isSkeleton && styles.skeleton,
    className,
  );

  return (
    <span
      className={rootClassName}
      {...rest}
      aria-hidden
      ref={ref}
      inert={isSkeleton || undefined}
    >
      {count && count > 99 ? "99+" : count}
    </span>
  );
});

export default CounterBadge;
