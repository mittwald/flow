import type { ContainerBreakpointSize } from "~/lib/types/props";

export const getContainerBreakpointSizeClassName = (
  containerBreakpointSize: ContainerBreakpointSize,
): string => `container-breakpoint-size-${containerBreakpointSize}`;
