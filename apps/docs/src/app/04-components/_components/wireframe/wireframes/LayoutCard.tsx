"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const LayoutCardWireframe: FC = () => (
  <WFrame>
    <WBox>
      <WStack>
        <WText width="54%" />
        <WText width="82%" />
        <WText width="75%" />
      </WStack>
    </WBox>
  </WFrame>
);

export default LayoutCardWireframe;
