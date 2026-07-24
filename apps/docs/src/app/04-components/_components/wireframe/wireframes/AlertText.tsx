"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconDanger } from "@mittwald/flow-react-components";

export const AlertTextWireframe: FC = () => (
  <WFrame justifyContent="center" width="50%">
    <WIcon tone="800">
      <IconDanger size="s" />
    </WIcon>
    <WText tone="800" />
  </WFrame>
);

export default AlertTextWireframe;
