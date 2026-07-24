"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconStar } from "@mittwald/flow-react-components";

export const IllustratedMessageWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack alignItems="center">
      <WIcon tone="800">
        <IconStar size="l" />
      </WIcon>
      <WText width="50%" />
      <WText width="68%" />
    </WStack>
  </WFrame>
);

export default IllustratedMessageWireframe;
