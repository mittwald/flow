"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconCode } from "@mittwald/flow-react-components";

export const InlineCodeWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WRow width="60%">
      <WIcon>
        <IconCode />
      </WIcon>
      <WText tone="500" />
    </WRow>
  </WFrame>
);

export default InlineCodeWireframe;
