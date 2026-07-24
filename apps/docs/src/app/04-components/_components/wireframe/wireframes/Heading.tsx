"use client";
import type { FC } from "react";
import {
  WFrame,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const HeadingWireframe: FC = () => (
  <WFrame>
    <WText width="64%" height="var(--size-px--l)" />
  </WFrame>
);

export default HeadingWireframe;
