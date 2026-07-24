"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const ActionGroupWireframe: FC = () => (
  <WFrame>
    <WRow justifyContent="space-between">
      <WBox tone="300" width={80}>
        <WText />
      </WBox>
      <WRow width="auto">
        <WBox tone="300" width={80}>
          <WText />
        </WBox>
        <WBox tone="800" width={80}>
          <WText />
        </WBox>
      </WRow>
    </WRow>
  </WFrame>
);

export default ActionGroupWireframe;
