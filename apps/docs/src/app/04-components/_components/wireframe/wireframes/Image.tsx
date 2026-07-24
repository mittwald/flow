"use client";
import type { FC } from "react";
import { WFrame } from "@/app/04-components/_components/wireframe/primitives";
import { IconImage } from "@mittwald/flow-react-components";

export const ImageWireframe: FC = () => (
  <WFrame justifyContent="center">
    <IconImage size="l" />
  </WFrame>
);

export default ImageWireframe;
