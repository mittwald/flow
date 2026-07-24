"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
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
        <WIcon tone="800">
          <IconCheckboxChecked />
        </WIcon>
        <WText />
      </WRow>
      <WRow alignItems="center" width="100%">
        <WIcon tone="800">
          <IconCheckboxEmpty />
        </WIcon>
        <WText />
      </WRow>
    </WStack>
  </WFrame>
);

export default CheckboxGroupWireframe;
