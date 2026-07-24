"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
} from "@/app/04-components/_components/wireframe/primitives";

export const ButtonWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WBox tone="700" width="58%" height={48} />
  </WFrame>
);

export default ButtonWireframe;
