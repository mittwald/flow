"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WOverlay,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const TooltipWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack alignItems="center" width={200}>
      <WOverlay>
        <WText />
      </WOverlay>
      <WButton width="80%" />
    </WStack>
  </WFrame>
);

export default TooltipWireframe;
