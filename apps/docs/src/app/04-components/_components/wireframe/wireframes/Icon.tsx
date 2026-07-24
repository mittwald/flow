"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconStar } from "@mittwald/flow-react-components";

export const IconWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WIcon tone="800">
      <IconStar size="l" />
    </WIcon>
  </WFrame>
);

export default IconWireframe;
