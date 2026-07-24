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
      <WRow>
        <WIcon tone="800">
          <IconDanger size="s" />
        </WIcon>
        <WText width="48%" tone="800" />
      </WRow>
      <WText width="88%" />
    </WBox>
  </WFrame>
);

export default AlertWireframe;
