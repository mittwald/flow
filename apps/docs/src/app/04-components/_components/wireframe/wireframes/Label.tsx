"use client";
import type { FC } from "react";
import {
  WFrame,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const LabelWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WText width="34%" tone="600" />
  </WFrame>
);

export default LabelWireframe;
