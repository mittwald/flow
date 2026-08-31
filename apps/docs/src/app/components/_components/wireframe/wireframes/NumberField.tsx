"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WInput,
  WStack,
  WText,
} from "@/app/components/_components/wireframe/primitives";
import { IconPlus, IconMinus } from "@mittwald/flow-react-components";

export const NumberFieldWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WText width="34%" />
      <WInput justifyContent="flex-end">
        <WIcon>
          <IconPlus />
        </WIcon>
        <WIcon>
          <IconMinus />
        </WIcon>
      </WInput>
    </WStack>
  </WFrame>
);

export default NumberFieldWireframe;
