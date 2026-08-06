"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WInput,
  WRow,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconDate } from "@mittwald/flow-react-components";
import { IconMinus } from "@mittwald/flow-react-components";

export const DateRangePickerWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WText width="34%" />
      <WInput justifyContent="space-between">
        <WRow>
          <WText tone="400" width="30%" />
          <WIcon size={16}>
            <IconMinus />
          </WIcon>
          <WText tone="400" width="30%" />
        </WRow>
        <WIcon>
          <IconDate />
        </WIcon>
      </WInput>
    </WStack>
  </WFrame>
);

export default DateRangePickerWireframe;
