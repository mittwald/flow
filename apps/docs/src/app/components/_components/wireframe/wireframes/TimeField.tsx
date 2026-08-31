"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WInput,
  WStack,
  WText,
} from "@/app/components/_components/wireframe/primitives";
import { IconTime } from "@mittwald/flow-react-components";

export const TimeFieldWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WText width="34%" />
      <WInput justifyContent="flex-end">
        <WIcon>
          <IconTime />
        </WIcon>
      </WInput>
    </WStack>
  </WFrame>
);

export default TimeFieldWireframe;
