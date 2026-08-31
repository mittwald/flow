"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
  WStack,
  WText,
} from "@/app/components/_components/wireframe/primitives";

export const FieldWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WText width="34%" />
      <WInput />
    </WStack>
  </WFrame>
);

export default FieldWireframe;
