"use client";
import type { FC } from "react";
import {
  WFrame,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconStar } from "@mittwald/flow-react-components";

export const IllustratedMessageWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack alignItems="center">
      <IconStar size="l" />
      <WText width="50%" />
      <WText width="68%" />
    </WStack>
  </WFrame>
);

export default IllustratedMessageWireframe;
