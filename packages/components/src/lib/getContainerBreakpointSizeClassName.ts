import type { ContainerBreakpointSize } from "@/lib/types/props";
import type styles from "@/components/SegmentedControl/SegmentedControl.module.scss";

export const getContainerBreakpointSizeClassName = (
  containerBreakpointSize: ContainerBreakpointSize,
): keyof typeof styles =>
  `container-breakpoint-size-${containerBreakpointSize}`;
