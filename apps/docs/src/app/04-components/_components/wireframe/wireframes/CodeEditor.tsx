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
    <WStack>
      <WText width="34%" />
      <WInput>
        <WStack>
          <WRow>
            <WIcon>
              <IconCode />
            </WIcon>
            <WText width="74%" />
          </WRow>
          <WText width="90%" />
        </WStack>
      </WInput>
    </WStack>
  </WFrame>
);

export default CodeEditorWireframe;
