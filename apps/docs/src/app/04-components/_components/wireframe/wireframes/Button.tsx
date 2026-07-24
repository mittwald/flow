"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const ButtonWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WButton width="58%">
      <WText />
    </WButton>
  </WFrame>
);

export default ButtonWireframe;
