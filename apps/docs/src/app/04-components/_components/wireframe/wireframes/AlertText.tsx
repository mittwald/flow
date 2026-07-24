"use client";
import type { FC } from "react";
import {
  WFrame,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconDanger } from "@mittwald/flow-react-components";

export const AlertTextWireframe: FC = () => (
  <WFrame justifyContent="center" width="50%">
    <IconDanger size="s" />
    <WText tone="800" />
  </WFrame>
);

export default AlertTextWireframe;
