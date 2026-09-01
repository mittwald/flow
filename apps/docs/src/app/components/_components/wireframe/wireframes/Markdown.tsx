"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WRow,
  WStack,
  WText,
} from "@/app/components/_components/wireframe/primitives";
import { IconNumber } from "@mittwald/flow-react-components";

export const MarkdownWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WRow>
        <WIcon>
          <IconNumber />
        </WIcon>
        <WText width="56%" />
      </WRow>
      <WText width="92%" />
      <WText width="78%" />
    </WStack>
  </WFrame>
);

export default MarkdownWireframe;
