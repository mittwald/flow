"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WInput,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconDate } from "@mittwald/flow-react-components";

export const DatePickerWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WText width="34%" />
      <WInput justifyContent="flex-end">
        <WIcon>
          <IconDate />
        </WIcon>
      </WInput>
    </WStack>
  </WFrame>
);

export default DatePickerWireframe;
