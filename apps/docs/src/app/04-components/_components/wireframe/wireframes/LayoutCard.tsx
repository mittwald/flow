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
        <WText width="92%" />
        <WText width="78%" />
      </WStack>
    </WBox>
  </WFrame>
);

export default LayoutCardWireframe;
