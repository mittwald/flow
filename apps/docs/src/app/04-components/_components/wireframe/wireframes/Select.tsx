"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WInput,
  WOverlay,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconChevronDown } from "@mittwald/flow-react-components";

export const SelectWireframe: FC = () => (
  <WFrame flexDirection="column">
    <WInput justifyContent="flex-end">
      <WIcon tone="800">
        <IconChevronDown />
      </WIcon>
    </WInput>
    <WOverlay>
      <WText width="80%" />
      <WText />
    </WOverlay>
  </WFrame>
);

export default SelectWireframe;
