"use client";
import type { FC } from "react";
import {
  WFrame,
  WStack,
  WText,
} from "@/app/components/_components/wireframe/primitives";

export const SkeletonTextWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack width="72%">
      <WText tone="300" height={28} width="46%" />
      <WText tone="300" />
      <WText tone="300" width="74%" />
    </WStack>
  </WFrame>
);

export default SkeletonTextWireframe;
