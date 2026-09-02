"use client";
import type { FC } from "react";
import {
  WFrame,
  WText,
} from "@/app/components/_components/wireframe/primitives";

export const HeadingWireframe: FC = () => (
  <WFrame>
    <WText width="64%" height={32} />
  </WFrame>
);

export default HeadingWireframe;
