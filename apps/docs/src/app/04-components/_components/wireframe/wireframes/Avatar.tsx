"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconUser } from "@mittwald/flow-react-components";

export const AvatarWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WCircle
      tone="500"
      width="var(--size-px--xxl)"
      height="var(--size-px--xxl)"
    >
      <IconUser size="m" />
    </WCircle>
  </WFrame>
);

export default AvatarWireframe;
