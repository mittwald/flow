"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WRow,
} from "@/app/04-components/_components/wireframe/primitives";

export const FlexWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WRow width="78%">
      <WBox width="31%" height="var(--size-px--xxl)" />
      <WBox width="31%" height="var(--size-px--xxl)" />
      <WBox width="31%" height="var(--size-px--xxl)" />
    </WRow>
  </WFrame>
);

export default FlexWireframe;
