"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WInput,
  WRow,
  WStack,
} from "@/app/04-components/_components/wireframe/primitives";

export const FormWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WStack>
        <WInput />
      </WStack>
      <WStack>
        <WInput />
      </WStack>
      <WRow justifyContent="flex-end">
        <WBox width="40%" />
      </WRow>
    </WStack>
  </WFrame>
);

export default FormWireframe;
