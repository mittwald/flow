"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WIcon,
} from "@/app/components/_components/wireframe/primitives";
import { IconCopy } from "@mittwald/flow-react-components";

export const CopyButtonWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WButton width="fit-content">
      <WIcon tone="300">
        <IconCopy />
      </WIcon>
    </WButton>
  </WFrame>
);

export default CopyButtonWireframe;
