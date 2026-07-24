"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const SkeletonWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack width="72%">
      <WBox tone="300" height="var(--size-px--xxl)" />
      <WText tone="300" width="88%" />
      <WText tone="300" width="62%" />
    </WStack>
  </WFrame>
);

export default SkeletonWireframe;
