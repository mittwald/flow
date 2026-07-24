"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const BadgeWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WBox tone="400" width="50%" borderRadius={24}>
      <WText />
    </WBox>
  </WFrame>
);

export default BadgeWireframe;
