"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
  WIcon,
} from "@/app/components/_components/wireframe/primitives";
import { IconUser } from "@mittwald/flow-react-components";

export const AvatarWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WCircle tone="600" size={72}>
      <WIcon tone="400" size={56}>
        <IconUser />
      </WIcon>
    </WCircle>
  </WFrame>
);

export default AvatarWireframe;
