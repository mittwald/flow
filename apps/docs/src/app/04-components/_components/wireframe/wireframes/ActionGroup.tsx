"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const ActionGroupWireframe: FC = () => (
  <WFrame>
    <WRow justifyContent="space-between">
      <WButton tone="400" width={70}>
        <WText />
      </WButton>
      <WRow width="auto">
        <WButton tone="400" width={70}>
          <WText />
        </WButton>
        <WButton width={70}>
          <WText />
        </WButton>
      </WRow>
    </WRow>
  </WFrame>
);

export default ActionGroupWireframe;
