"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WIcon,
} from "@/app/components/_components/wireframe/primitives";
import { IconPending } from "@mittwald/flow-react-components";

export const ActionWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WButton width="58%" justifyContent="center">
      <WIcon tone="300">
        <IconPending />
      </WIcon>
    </WButton>
  </WFrame>
);

export default ActionWireframe;
