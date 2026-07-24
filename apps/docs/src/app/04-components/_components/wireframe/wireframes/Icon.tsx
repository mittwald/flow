"use client";
import type { FC } from "react";
import { WFrame } from "@/app/04-components/_components/wireframe/primitives";
import { IconStar } from "@mittwald/flow-react-components";

export const IconWireframe: FC = () => (
  <WFrame justifyContent="center">
    <IconStar size="l" />
  </WFrame>
);

export default IconWireframe;
