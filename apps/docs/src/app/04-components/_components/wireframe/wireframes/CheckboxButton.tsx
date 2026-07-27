"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WIcon,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconCheckboxChecked } from "@mittwald/flow-react-components";

export const CheckboxButtonWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WButton width="64%">
      <WRow alignItems="center" width="90%">
        <WIcon tone="400">
          <IconCheckboxChecked />
        </WIcon>
        <WText />
      </WRow>
    </WButton>
  </WFrame>
);

export default CheckboxButtonWireframe;
