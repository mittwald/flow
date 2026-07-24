"use client";
import type { FC } from "react";
import {
  WBox,
  WCircle,
  WFrame,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const FileCardWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WBox width="80%" flexDirection="row">
      <WCircle height={42} width={42} />
      <WStack width="70%">
        <WText width="80%" />
        <WText width="100%" />
      </WStack>
    </WBox>
  </WFrame>
);

export default FileCardWireframe;
