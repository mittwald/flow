"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WOverlay,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconInfo } from "@mittwald/flow-react-components";

export const ContextualHelpWireframe: FC = () => (
  <WFrame>
    <WIcon tone="800">
      <IconInfo />
    </WIcon>
    <WOverlay>
      <WText width="70%" />
      <WText />
    </WOverlay>
  </WFrame>
);

export default ContextualHelpWireframe;
