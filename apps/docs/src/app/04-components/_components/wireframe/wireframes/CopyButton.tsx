"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WIcon,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconCopy } from "@mittwald/flow-react-components";

export const CopyButtonWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WButton width="fit-content">
      <WIcon tone="400">
        <IconCopy />
      </WIcon>
    </WButton>
  </WFrame>
);

export default CopyButtonWireframe;
