"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconPalette } from "@tabler/icons-react";
import { Icon } from "@mittwald/flow-react-components";

export const ColorWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WIcon tone="800">
      <Icon size="l">
        <IconPalette />
      </Icon>
    </WIcon>
  </WFrame>
);

export default ColorWireframe;
