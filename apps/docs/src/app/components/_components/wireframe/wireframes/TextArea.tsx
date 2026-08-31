"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
  WStack,
  WText,
} from "@/app/components/_components/wireframe/primitives";

export const TextAreaWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WText width="34%" />
      <WInput height={80} />
    </WStack>
  </WFrame>
);

export default TextAreaWireframe;
