import type { ContainerBreakpointSize } from "@/lib/types/props";

export const getContainerBreakpointSizeClassName = (
  containerBreakpointSize: ContainerBreakpointSize,
) => `container-breakpoint-size-${containerBreakpointSize}`;
