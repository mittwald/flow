"use client";
import type { FC } from "react";
import {
  WFrame,
  WLine,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const SectionWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WStack>
        <WText width="42%" tone="600" />
        <WText width="82%" tone="600" />
      </WStack>
      <WLine marginBlock={16} />
      <WStack>
        <WText width="42%" />
        <WText width="82%" />
      </WStack>
    </WStack>
  </WFrame>
);

export default SectionWireframe;
