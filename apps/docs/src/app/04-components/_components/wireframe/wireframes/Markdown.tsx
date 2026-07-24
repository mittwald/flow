"use client";
import type { FC } from "react";
import {
  WFrame,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const MarkdownWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WText width="56%" />
      <WText width="92%" />
      <WText width="78%" />
      <WText width="64%" />
    </WStack>
  </WFrame>
);

export default MarkdownWireframe;
