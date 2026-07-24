"use client";
import type { FC } from "react";
import {
  WFrame,
  WOverlay,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconInfo } from "@mittwald/flow-react-components";

export const ContextualHelpWireframe: FC = () => (
  <WFrame>
    <IconInfo />
    <WOverlay>
      <WText width="70%" />
      <WText />
    </WOverlay>
  </WFrame>
);

export default ContextualHelpWireframe;
