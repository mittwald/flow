"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconPlus, IconMinus } from "@mittwald/flow-react-components";

export const NumberFieldWireframe: FC = () => (
  <WFrame>
    <WInput justifyContent="flex-end">
      <IconPlus />
      <IconMinus />
    </WInput>
  </WFrame>
);

export default NumberFieldWireframe;
