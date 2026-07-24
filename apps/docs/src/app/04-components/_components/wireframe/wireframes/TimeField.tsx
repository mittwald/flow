"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WInput,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconTime } from "@mittwald/flow-react-components";

export const TimeFieldWireframe: FC = () => (
  <WFrame>
    <WInput justifyContent="flex-end">
      <WIcon tone="800">
        <IconTime />
      </WIcon>
    </WInput>
  </WFrame>
);

export default TimeFieldWireframe;
