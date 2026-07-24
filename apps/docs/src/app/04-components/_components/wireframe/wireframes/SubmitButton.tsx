"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WInput,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const SubmitButtonWireframe: FC = () => (
  <WFrame flexDirection="column" alignItems="flex-end">
    <WInput />
    <WButton width="45%">
      <WText />
    </WButton>
  </WFrame>
);

export default SubmitButtonWireframe;
