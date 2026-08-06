"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
  WOverlay,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const AutocompleteWireframe: FC = () => (
  <WFrame flexDirection="column">
    <WInput />
    <WOverlay width="60%">
      <WText width="80%" />
      <WText />
    </WOverlay>
  </WFrame>
);

export default AutocompleteWireframe;
