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
      <WStack>
        <WText width="42%" />
        <WText width="82%" />
      </WStack>
      <WLine marginBlock={16} tone="600" />
      <WStack>
        <WText width="42%" />
        <WText width="82%" />
      </WStack>
    </WStack>
  </WFrame>
);

export default SeparatorWireframe;
