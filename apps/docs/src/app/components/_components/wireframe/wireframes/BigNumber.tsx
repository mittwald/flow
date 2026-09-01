"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
  WStack,
  WText,
} from "@/app/components/_components/wireframe/primitives";

export const BigNumberWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack alignItems="center" width={72}>
      <WCircle size={72} />
      <WText />
    </WStack>
  </WFrame>
);

export default BigNumberWireframe;
