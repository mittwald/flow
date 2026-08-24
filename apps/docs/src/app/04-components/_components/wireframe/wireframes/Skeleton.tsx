"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WStack,
} from "@/app/04-components/_components/wireframe/primitives";

export const SkeletonWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack width="72%">
      <WBox tone="300" height={64} />
    </WStack>
  </WFrame>
);

export default SkeletonWireframe;
