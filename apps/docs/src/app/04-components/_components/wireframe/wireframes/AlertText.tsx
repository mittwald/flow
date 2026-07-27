"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconDanger } from "@mittwald/flow-react-components";

export const AlertTextWireframe: FC = () => (
  <WFrame justifyContent="center" alignItems="center" width="50%">
    <WIcon tone="800">
      <IconDanger />
    </WIcon>
    <WText tone="700" />
  </WFrame>
);

export default AlertTextWireframe;
