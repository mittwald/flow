"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconDanger } from "@mittwald/flow-react-components";

export const AlertWireframe: FC = () => (
  <WFrame>
    <WBox>
      <WRow>
        <IconDanger size="s" />
        <WText width="48%" tone="800" />
      </WRow>
      <WText width="88%" />
    </WBox>
  </WFrame>
);

export default AlertWireframe;
