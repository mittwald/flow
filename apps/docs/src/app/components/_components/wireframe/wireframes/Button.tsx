"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
} from "@/app/components/_components/wireframe/primitives";

export const ButtonWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WButton width="58%" />
  </WFrame>
);

export default ButtonWireframe;
