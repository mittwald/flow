"use client";
import type { FC } from "react";
import {
  WFrame,
  WOverlay,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconImage } from "@mittwald/flow-react-components";

export const LightBoxWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WOverlay width="60%" alignItems="center">
      <IconImage size="l" />
    </WOverlay>
  </WFrame>
);

export default LightBoxWireframe;
