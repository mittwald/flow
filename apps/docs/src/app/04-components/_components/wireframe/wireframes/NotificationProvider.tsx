"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WOverlay,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconDanger } from "@mittwald/flow-react-components";

export const NotificationProviderWireframe: FC = () => (
  <WFrame flexDirection="column">
    <WOverlay>
      <WRow alignItems="center">
        <WIcon>
          <IconDanger />
        </WIcon>
        <WText width="48%" tone="700" />
      </WRow>
      <WText width="88%" />
    </WOverlay>
    <WOverlay>
      <WRow alignItems="center">
        <WIcon>
          <IconDanger />
        </WIcon>
        <WText width="60%" tone="700" />
      </WRow>
      <WText width="80%" />
    </WOverlay>
  </WFrame>
);

export default NotificationProviderWireframe;
