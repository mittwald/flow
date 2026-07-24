"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
} from "@/app/04-components/_components/wireframe/primitives";

export const KbdWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WBox width="fit-content">⌘ + k</WBox>
  </WFrame>
);

export default KbdWireframe;
