"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
} from "@/app/04-components/_components/wireframe/primitives";

export const PasswordCreationFieldWireframe: FC = () => (
  <WFrame>
    <WInput>*****</WInput>
  </WFrame>
);

export default PasswordCreationFieldWireframe;
