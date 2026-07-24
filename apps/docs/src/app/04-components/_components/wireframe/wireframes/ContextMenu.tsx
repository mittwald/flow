"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WOverlay,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconContextMenu } from "@mittwald/flow-react-components";

export const ContextMenuWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WBox width="fit-content">
        <IconContextMenu size="s" />
      </WBox>
      <WOverlay>
        <WText width="70%" />
        <WText />
      </WOverlay>
    </WStack>
  </WFrame>
);

export default ContextMenuWireframe;
