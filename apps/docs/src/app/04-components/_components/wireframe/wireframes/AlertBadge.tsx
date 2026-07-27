"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WIcon,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconDanger } from "@mittwald/flow-react-components";

export const AlertBadgeWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WBox flexDirection="row" width="60%" borderRadius={30} alignItems="center">
      <WIcon tone="800">
        <IconDanger />
      </WIcon>
      <WText tone="700" />
    </WBox>
  </WFrame>
);

export default AlertBadgeWireframe;
