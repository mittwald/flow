"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WRow,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconRadioOff, IconRadioOn } from "@mittwald/flow-react-components";

export const RadioGroupWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack width="80%">
      <WRow width="80%">
        <WIcon>
          <IconRadioOn />
        </WIcon>
        <WText />
      </WRow>
      <WRow width="100%">
        <WIcon>
          <IconRadioOff />
        </WIcon>
        <WText />
      </WRow>
    </WStack>
  </WFrame>
);

export default RadioGroupWireframe;
