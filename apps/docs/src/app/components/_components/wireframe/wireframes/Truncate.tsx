"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
} from "@/app/components/_components/wireframe/primitives";
import { IconContextMenu } from "@mittwald/flow-react-components";

export const TruncateWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WIcon size={64}>
      <IconContextMenu />
    </WIcon>
  </WFrame>
);

export default TruncateWireframe;
