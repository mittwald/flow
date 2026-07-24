"use client";
import type { FC } from "react";
import {
  WFrame,
  WLine,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const SeparatorWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WText width="82%" />
      <WLine marginBlock={16} />
      <WText width="72%" />
    </WStack>
  </WFrame>
);

export default SeparatorWireframe;
