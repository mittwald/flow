"use client";
import type { FC } from "react";
import {
  WBox,
  WCircle,
  WFrame,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const MessageWireframe: FC = () => (
  <WFrame>
    <WRow>
      <WCircle width={32} height={32} />
      <WBox>
        <WText />
        <WText width="80%" />
      </WBox>
    </WRow>
  </WFrame>
);

export default MessageWireframe;
