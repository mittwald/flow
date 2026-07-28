"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconContextMenu } from "@mittwald/flow-react-components";

export const TruncateWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WIcon>
      <IconContextMenu size="l" />
    </WIcon>
  </WFrame>
);

export default TruncateWireframe;
