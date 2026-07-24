"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
} from "@/app/04-components/_components/wireframe/primitives";

export const TextAreaWireframe: FC = () => (
  <WFrame>
    <WInput height={80} />
  </WFrame>
);

export default TextAreaWireframe;
