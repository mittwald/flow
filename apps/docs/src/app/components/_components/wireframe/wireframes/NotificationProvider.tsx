"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WOverlay,
  WRow,
  WText,
} from "@/app/components/_components/wireframe/primitives";
import { IconDanger } from "@mittwald/flow-react-components";

export const NotificationProviderWireframe: FC = () => (
  <WFrame flexDirection="column" justifyContent="center">
    <WOverlay width="80%">
      <WRow>
        <WIcon>
          <IconDanger />
        </WIcon>
        <WText width="48%" tone="700" />
      </WRow>
    </WOverlay>
    <WOverlay width="80%">
      <WRow>
        <WIcon>
          <IconDanger />
        </WIcon>
        <WText width="60%" tone="700" />
      </WRow>
    </WOverlay>
  </WFrame>
);

export default NotificationProviderWireframe;
