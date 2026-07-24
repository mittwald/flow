"use client";
import type { FC } from "react";
import { WFrame } from "@/app/04-components/_components/wireframe/primitives";
import { IconLoader2 } from "@tabler/icons-react";
import { Icon } from "@mittwald/flow-react-components";

export const LoadingSpinnerWireframe: FC = () => (
  <WFrame justifyContent="center">
    <Icon size="l">
      <IconLoader2 />
    </Icon>
  </WFrame>
);

export default LoadingSpinnerWireframe;
