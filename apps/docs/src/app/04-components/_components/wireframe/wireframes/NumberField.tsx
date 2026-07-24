"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WInput,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconPlus, IconMinus } from "@mittwald/flow-react-components";

export const NumberFieldWireframe: FC = () => (
  <WFrame>
    <WInput justifyContent="flex-end">
      <WIcon tone="800">
        <IconPlus />
      </WIcon>
      <WIcon tone="800">
        <IconMinus />
      </WIcon>
    </WInput>
  </WFrame>
);

export default NumberFieldWireframe;
