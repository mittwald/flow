"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconCopy } from "@mittwald/flow-react-components";

export const CopyButtonWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WBox width="fit-content">
      <IconCopy size="s" />
    </WBox>
  </WFrame>
);

export default CopyButtonWireframe;
