"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const AlignWireframe: FC = () => (
  <WFrame alignItems="center">
    <WCircle height={48} width={48} />
    <WStack width="70%">
      <WText width="80%" />
      <WText width="100%" />
    </WStack>
  </WFrame>
);

export default AlignWireframe;
