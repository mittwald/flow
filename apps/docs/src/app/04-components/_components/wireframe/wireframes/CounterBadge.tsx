"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
} from "@/app/04-components/_components/wireframe/primitives";

export const CounterBadgeWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WCircle>3</WCircle>
  </WFrame>
);

export default CounterBadgeWireframe;
