"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WInput,
} from "@/app/components/_components/wireframe/primitives";

export const SubmitButtonWireframe: FC = () => (
  <WFrame flexDirection="column" alignItems="flex-end">
    <WInput />
    <WButton width="45%" />
  </WFrame>
);

export default SubmitButtonWireframe;
