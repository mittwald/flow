"use client";
import type { FC } from "react";
import {
  WFrame,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const TextWireframe: FC = () => (
  <WFrame flexDirection="column">
    <WText width="84%" />
    <WText width="58%" />
  </WFrame>
);

export default TextWireframe;
