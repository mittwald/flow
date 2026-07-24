"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
  WIcon,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconUser } from "@mittwald/flow-react-components";

export const AvatarWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WCircle
      tone="500"
      width="var(--size-px--xxl)"
      height="var(--size-px--xxl)"
    >
      <WIcon tone="800">
        <IconUser size="m" />
      </WIcon>
    </WCircle>
  </WFrame>
);

export default AvatarWireframe;
