"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
  WOverlay,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const TooltipWireframe: FC = () => (
  <WFrame>
    <WStack alignItems="center">
      <WOverlay tone="700" width={100}>
        <WText tone="200" />
      </WOverlay>
      <WCircle
        tone="600"
        width="var(--size-px--m)"
        height="var(--size-px--m)"
      />
    </WStack>
  </WFrame>
);

export default TooltipWireframe;
