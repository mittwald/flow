"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const NavigationWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WBox width="40%">
      <WText />
      <WText width="80%" />
      <WText />
      <WText width="90%" />
    </WBox>
  </WFrame>
);

export default NavigationWireframe;
