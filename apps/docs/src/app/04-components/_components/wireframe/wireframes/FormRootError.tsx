"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WIcon,
  WInput,
  WRow,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconDanger } from "@mittwald/flow-react-components";

export const FormRootErrorWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WStack>
        <WInput />
      </WStack>
      <WStack>
        <WInput />
      </WStack>

      <WBox tone="300">
        <WRow>
          <WIcon>
            <IconDanger />
          </WIcon>
          <WText tone="700" />
        </WRow>
      </WBox>
    </WStack>
  </WFrame>
);

export default FormRootErrorWireframe;
