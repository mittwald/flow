"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WRow,
} from "@/app/04-components/_components/wireframe/primitives";

export const ActionGroupWireframe: FC = () => (
  <WFrame>
    <WRow justifyContent="space-between">
      <WButton tone="400" width="25%" />
      <WRow width="60%">
        <WButton tone="400" />
        <WButton />
      </WRow>
    </WRow>
  </WFrame>
);

export default ActionGroupWireframe;
