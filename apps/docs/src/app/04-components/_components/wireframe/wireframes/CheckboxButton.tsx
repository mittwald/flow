"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconCheckboxChecked } from "@mittwald/flow-react-components";

export const CheckboxButtonWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WBox width="64%">
      <WRow alignItems="center">
        <IconCheckboxChecked />
        <WText />
      </WRow>
    </WBox>
  </WFrame>
);

export default CheckboxButtonWireframe;
