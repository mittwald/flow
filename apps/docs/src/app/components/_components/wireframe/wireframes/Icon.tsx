"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
} from "@/app/components/_components/wireframe/primitives";
import { IconStar } from "@mittwald/flow-react-components";

export const IconWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WIcon size={64}>
      <IconStar />
    </WIcon>
  </WFrame>
);

export default IconWireframe;
