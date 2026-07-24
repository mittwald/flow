"use client";
import type { FC } from "react";
import {
  WFrame,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconCheckboxChecked } from "@mittwald/flow-react-components";

export const CheckboxWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WRow alignItems="center" width="64%">
      <IconCheckboxChecked />
      <WText />
    </WRow>
  </WFrame>
);

export default CheckboxWireframe;
