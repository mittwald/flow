"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const AccentBoxWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WBox tone="800">
        <WText width="60%" />
        <WText width="100%" />
      </WBox>
      <WBox tone="700">
        <WText width="50%" />
        <WText width="80%" />
      </WBox>
    </WStack>
  </WFrame>
);

export default AccentBoxWireframe;
