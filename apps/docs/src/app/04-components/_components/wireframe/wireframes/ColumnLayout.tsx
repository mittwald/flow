"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
  WRow,
  WStack,
} from "@/app/04-components/_components/wireframe/primitives";

export const ColumnLayoutWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WInput />
      <WRow>
        <WInput />
        <WInput />
      </WRow>
    </WStack>
  </WFrame>
);

export default ColumnLayoutWireframe;
