"use client";
import type { FC } from "react";
import {
  WFrame,
  WStack,
  WText,
} from "@/app/components/_components/wireframe/primitives";

export const LabeledValueWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack width="62%">
      <WText width="42%" tone="600" />
      <WText width="78%" />
    </WStack>
  </WFrame>
);

export default LabeledValueWireframe;
