"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconContextMenu } from "@mittwald/flow-react-components";

export const TruncateWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WRow width="78%">
      <WText width="72%" />
      <WIcon tone="800">
        <IconContextMenu />
      </WIcon>
    </WRow>
  </WFrame>
);

export default TruncateWireframe;
