"use client";
import type { FC } from "react";
import {
  WFrame,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconChevronRight } from "@mittwald/flow-react-components";

export const BreadcrumbWireframe: FC = () => (
  <WFrame>
    <WRow>
      <WText width="22%" />
      <IconChevronRight size="s" />
      <WText width="26%" />
      <IconChevronRight size="s" /> <WText width="16%" />
    </WRow>
  </WFrame>
);

export default BreadcrumbWireframe;
