"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const InlineCodeWireframe: FC = () => (
  <WFrame>
    <WRow alignItems="center">
      <WText tone="500" width="20%" />
      <WBox tone="300" width="35%">
        <WText />
      </WBox>
      <WText tone="500" width="35%" />
    </WRow>
  </WFrame>
);

export default InlineCodeWireframe;
