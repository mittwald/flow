"use client";
import type { FC } from "react";
import {
  WFrame,
  WRow,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconRadioOff, IconRadioOn } from "@mittwald/flow-react-components";

export const RadioGroupWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack width="80%">
      <WRow alignItems="center" width="80%">
        <IconRadioOn />
        <WText />
      </WRow>
      <WRow alignItems="center" width="100%">
        <IconRadioOff />
        <WText />
      </WRow>
    </WStack>
  </WFrame>
);

export default RadioGroupWireframe;
