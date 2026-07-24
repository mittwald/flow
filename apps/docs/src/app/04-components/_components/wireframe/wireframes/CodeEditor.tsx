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
import { IconCode } from "@mittwald/flow-react-components";

export const CodeEditorWireframe: FC = () => (
  <WFrame>
    <WInput>
      <WStack>
        <WRow>
          <WIcon tone="800">
            <IconCode size="s" />
          </WIcon>
          <WText width="74%" />
        </WRow>
        <WText width="90%" />
      </WStack>
    </WInput>
  </WFrame>
);

export default CodeEditorWireframe;
