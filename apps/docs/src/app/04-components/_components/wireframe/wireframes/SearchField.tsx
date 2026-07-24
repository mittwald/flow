"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconSearch } from "@mittwald/flow-react-components";

export const SearchFieldWireframe: FC = () => (
  <WFrame>
    <WInput>
      <IconSearch />
    </WInput>
  </WFrame>
);

export default SearchFieldWireframe;
