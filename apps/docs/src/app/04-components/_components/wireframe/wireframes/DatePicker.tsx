"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconDate } from "@mittwald/flow-react-components";

export const DatePickerWireframe: FC = () => (
  <WFrame>
    <WInput justifyContent="flex-end">
      <IconDate />
    </WInput>
  </WFrame>
);

export default DatePickerWireframe;
