"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WInput,
  WRow,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconNumber } from "@mittwald/flow-react-components";

export const MarkdownEditorWireframe: FC = () => (
  <WFrame>
    <WInput>
      <WStack>
        <WRow alignItems="center">
          <WIcon>
            <IconNumber />
          </WIcon>
          <WText width="56%" />
        </WRow>
        <WText width="92%" />
        <WText width="78%" />
      </WStack>
    </WInput>
  </WFrame>
);

export default MarkdownEditorWireframe;
