"use client";
import type { FC } from "react";
import {
  WFrame,
  WLine,
  WStack,
  WText,
} from "@/app/components/_components/wireframe/primitives";

export const LinkWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack width="42%">
      <WText />
      <WLine height={2} tone="600" />
    </WStack>
  </WFrame>
);

export default LinkWireframe;
