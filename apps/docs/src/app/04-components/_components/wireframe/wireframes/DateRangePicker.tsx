"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconDate } from "@mittwald/flow-react-components";

export const DateRangePickerWireframe: FC = () => (
  <WFrame>
    <WInput justifyContent="space-between">
      <WRow alignItems="center">
        <WText tone="400" width="30%" />-<WText tone="400" width="30%" />
      </WRow>
      <IconDate />
    </WInput>
  </WFrame>
);

export default DateRangePickerWireframe;
