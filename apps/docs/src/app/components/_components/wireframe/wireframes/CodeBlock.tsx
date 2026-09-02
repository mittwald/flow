"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WIcon,
  WRow,
  WStack,
  WText,
} from "@/app/components/_components/wireframe/primitives";
import { IconCode } from "@mittwald/flow-react-components";

export const CodeBlockWireframe: FC = () => (
  <WFrame>
    <WBox>
      <WStack>
        <WRow>
          <WIcon>
            <IconCode />
          </WIcon>
          <WText width="74%" />
        </WRow>
        <WText width="90%" />
      </WStack>
    </WBox>
  </WFrame>
);

export default CodeBlockWireframe;
