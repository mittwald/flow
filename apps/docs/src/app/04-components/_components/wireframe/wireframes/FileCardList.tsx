"use client";
import type { FC } from "react";
import {
  WBox,
  WCircle,
  WFrame,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const FileCardListWireframe: FC = () => (
  <WFrame alignItems="center" flexDirection="column" scale={0.84}>
    <WBox width="80%" flexDirection="row">
      <WCircle size={42} />
      <WStack width="70%">
        <WText width="80%" />
        <WText width="100%" />
      </WStack>
    </WBox>
    <WBox width="80%" flexDirection="row">
      <WCircle size={42} />
      <WStack width="70%">
        <WText width="80%" />
        <WText width="100%" />
      </WStack>
    </WBox>
  </WFrame>
);

export default FileCardListWireframe;
