"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const MarkdownEditorWireframe: FC = () => (
  <WFrame>
    <WInput height={80} alignItems="flex-start">
      <WStack>
        <WText width="56%" />
        <WText width="92%" />
      </WStack>
    </WInput>
  </WFrame>
);

export default MarkdownEditorWireframe;
