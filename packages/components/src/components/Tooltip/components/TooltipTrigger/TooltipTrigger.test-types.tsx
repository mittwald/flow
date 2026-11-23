import { createRef } from "react";
import { TooltipTrigger } from "@/components/Tooltip";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testRef() {
  const ref = createRef<HTMLDivElement>();
  // @ts-expect-error TooltipTrigger has no element of its own to ref
  <TooltipTrigger ref={ref}>Content</TooltipTrigger>;
}
