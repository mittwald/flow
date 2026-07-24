"use client";
import type { FC } from "react";
import {
  WFrame,
  WRow,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import {
  IconCheckboxChecked,
  IconCheckboxEmpty,
} from "@mittwald/flow-react-components";

export const CheckboxGroupWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack width="80%">
      <WRow alignItems="center" width="80%">
        <IconCheckboxChecked />
        <WText />
      </WRow>
      <WRow alignItems="center" width="100%">
        <IconCheckboxEmpty />
        <WText />
      </WRow>
    </WStack>
  </WFrame>
);

export default CheckboxGroupWireframe;
