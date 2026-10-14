"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
} from "@/app/components/_components/wireframe/primitives";
import { IconPending } from "@mittwald/flow-react-components";

export const LoadingSpinnerWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WIcon size={64}>
      <IconPending />
    </WIcon>
  </WFrame>
);

export default LoadingSpinnerWireframe;
