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
    <WStack>
      <WText width="34%" />
      <WInput>
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
      </WInput>
    </WStack>
  </WFrame>
);

export default MarkdownEditorWireframe;
