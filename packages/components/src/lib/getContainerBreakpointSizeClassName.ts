import type { ContainerBreakpointSize } from "@/lib/types/props";

type ContainerBreakpointSizeClassName =
  `container-breakpoint-size-${ContainerBreakpointSize}`;

export const getContainerBreakpointSizeClassName = (
  containerBreakpointSize: ContainerBreakpointSize,
): ContainerBreakpointSizeClassName =>
  `container-breakpoint-size-${containerBreakpointSize}`;
