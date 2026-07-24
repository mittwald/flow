"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WInput,
} from "@/app/04-components/_components/wireframe/primitives";

export const SubmitButtonWireframe: FC = () => (
  <WFrame flexDirection="column" alignItems="flex-end">
    <WInput />
    <WBox tone="700" width="58%" height={48} />
  </WFrame>
);

export default SubmitButtonWireframe;
