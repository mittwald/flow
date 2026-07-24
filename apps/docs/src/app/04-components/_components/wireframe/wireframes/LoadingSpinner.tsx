"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconLoader2 } from "@tabler/icons-react";
import { Icon } from "@mittwald/flow-react-components";

export const LoadingSpinnerWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WIcon tone="800">
      <Icon size="l">
        <IconLoader2 />
      </Icon>
    </WIcon>
  </WFrame>
);

export default LoadingSpinnerWireframe;
