"use client";
import type { FC } from "react";
import {
  WBox,
  WCircle,
  WFrame,
  WRow,
  WText,
} from "@/app/components/_components/wireframe/primitives";

export const MessageWireframe: FC = () => (
  <WFrame>
    <WRow>
      <WCircle size={40} />
      <WBox>
        <WText />
        <WText width="80%" />
      </WBox>
    </WRow>
  </WFrame>
);

export default MessageWireframe;
