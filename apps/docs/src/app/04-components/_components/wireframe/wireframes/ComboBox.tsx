"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
  WOverlay,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconChevronDown } from "@mittwald/flow-react-components";

export const ComboBoxWireframe: FC = () => (
  <WFrame flexDirection="column">
    <WInput justifyContent="flex-end">
      <IconChevronDown />
    </WInput>
    <WOverlay>
      <WText width="80%" />
      <WText />
    </WOverlay>
  </WFrame>
);

export default ComboBoxWireframe;
