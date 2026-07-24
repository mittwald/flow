"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconDanger } from "@mittwald/flow-react-components";

export const AlertBadgeWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WBox flexDirection="row" width="50%" borderRadius={24}>
      <IconDanger size="s" />
      <WText tone="800" />
    </WBox>
  </WFrame>
);

export default AlertBadgeWireframe;
