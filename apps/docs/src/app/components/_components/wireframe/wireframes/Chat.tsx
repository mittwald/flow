"use client";
import type { FC } from "react";
import {
  WBox,
  WCircle,
  WFrame,
  WInput,
  WRow,
  WText,
} from "@/app/components/_components/wireframe/primitives";

export const ChatWireframe: FC = () => (
  <WFrame flexDirection="column">
    <WRow>
      <WCircle size={40} />
      <WBox>
        <WText />
        <WText width="80%" />
      </WBox>
    </WRow>
    <WInput />
  </WFrame>
);

export default ChatWireframe;
