"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WInput,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconSearch } from "@mittwald/flow-react-components";

export const SearchFieldWireframe: FC = () => (
  <WFrame>
    <WInput>
      <WIcon tone="800">
        <IconSearch />
      </WIcon>
    </WInput>
  </WFrame>
);

export default SearchFieldWireframe;
