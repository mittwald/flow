"use client";
import type { FC } from "react";
import {
  WBox,
  WCircle,
  WFrame,
  WInput,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const ChatWireframe: FC = () => (
  <WFrame flexDirection="column">
    <WRow>
      <WCircle width={32} height={32} />
      <WBox>
        <WText />
        <WText width="80%" />
      </WBox>
    </WRow>
    <WInput />
  </WFrame>
);

export default ChatWireframe;
