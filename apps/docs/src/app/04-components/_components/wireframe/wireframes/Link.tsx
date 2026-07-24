"use client";
import type { FC } from "react";
import {
  WFrame,
  WLine,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const LinkWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack width="42%">
      <WText />
      <WLine height="2px" />
    </WStack>
  </WFrame>
);

export default LinkWireframe;
