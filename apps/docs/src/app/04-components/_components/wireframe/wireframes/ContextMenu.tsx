"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WIcon,
  WOverlay,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconContextMenu } from "@mittwald/flow-react-components";

export const ContextMenuWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WButton width="fit-content">
        <WIcon tone="400">
          <IconContextMenu />
        </WIcon>
      </WButton>
      <WOverlay>
        <WText width="70%" />
        <WText />
      </WOverlay>
    </WStack>
  </WFrame>
);

export default ContextMenuWireframe;
