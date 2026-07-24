"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const BigNumberWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack alignItems="center" width="var(--size-px--xxl)">
      <WCircle width="var(--size-px--xxl)" height="var(--size-px--xxl)" />
      <WText />
    </WStack>
  </WFrame>
);

export default BigNumberWireframe;
