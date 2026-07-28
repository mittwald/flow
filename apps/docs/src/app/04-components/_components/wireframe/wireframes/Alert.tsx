"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WIcon,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconDanger } from "@mittwald/flow-react-components";

export const AlertWireframe: FC = () => (
  <WFrame>
    <WBox>
      <WRow alignItems="center">
        <WIcon>
          <IconDanger />
        </WIcon>
        <WText width="48%" tone="700" />
      </WRow>
      <WText width="88%" />
    </WBox>
  </WFrame>
);

export default AlertWireframe;
