"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WRow,
  WText,
} from "@/app/components/_components/wireframe/primitives";
import { IconCheckboxChecked } from "@mittwald/flow-react-components";

export const CheckboxWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WRow width="64%">
      <WIcon>
        <IconCheckboxChecked />
      </WIcon>
      <WText />
    </WRow>
  </WFrame>
);

export default CheckboxWireframe;
