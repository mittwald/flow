"use client";
import type { FC } from "react";
import {
  WBox,
  WCircle,
  WFrame,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const MessageThreadWireframe: FC = () => (
  <WFrame flexDirection="column">
    <WRow>
      <WCircle width={32} height={32} />
      <WBox width="70%">
        <WText />
        <WText width="80%" />
      </WBox>
    </WRow>
    <WRow justifyContent="flex-end">
      <WBox width="60%">
        <WText />
      </WBox>
      <WCircle width={32} height={32} />
    </WRow>
  </WFrame>
);

export default MessageThreadWireframe;
