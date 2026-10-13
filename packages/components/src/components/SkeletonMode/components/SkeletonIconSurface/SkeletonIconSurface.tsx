import type { FC, PropsWithChildren } from "react";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";
import { SkeletonModeReset } from "@/components/SkeletonMode/skeletonModeContext";
import styles from "./SkeletonIconSurface.module.scss";

export type SkeletonIconSurfaceProps = PropsWithChildren & PropsWithClassName;

/**
 * A round skeleton surface in the size of the icon it wraps. The icon keeps
 * rendering, invisible, so the surface takes its size from the icon's own size
 * rules. `className` places the surface where the icon would sit.
 */
export const SkeletonIconSurface: FC<SkeletonIconSurfaceProps> = (props) => {
  const { children, className } = props;

  return (
    <span className={clsx(styles.skeletonIconSurface, className)} inert>
      <SkeletonModeReset>{children}</SkeletonModeReset>
    </span>
  );
};

export default SkeletonIconSurface;
