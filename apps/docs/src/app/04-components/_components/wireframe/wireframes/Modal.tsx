"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WOverlay,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconClose } from "@mittwald/flow-react-components";

export const ModalWireframe: FC = () => (
  <WFrame>
    <WOverlay>
      <WRow justifyContent="space-between">
        <WText width="52%" />
        <WIcon tone="800">
          <IconClose size="s" />
        </WIcon>
      </WRow>
      <WText width="86%" />
      <WText width="64%" />
    </WOverlay>
  </WFrame>
);

export default ModalWireframe;
