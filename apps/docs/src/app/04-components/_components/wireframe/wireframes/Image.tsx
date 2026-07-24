"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconImage } from "@mittwald/flow-react-components";

export const ImageWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WIcon tone="800">
      <IconImage size="l" />
    </WIcon>
  </WFrame>
);

export default ImageWireframe;
