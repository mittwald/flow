"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconChevronRight } from "@mittwald/flow-react-components";

export const BreadcrumbWireframe: FC = () => (
  <WFrame>
    <WRow>
      <WText width="22%" />
      <WIcon tone="800">
        <IconChevronRight size="s" />
      </WIcon>
      <WText width="26%" />
      <WIcon tone="800">
        <IconChevronRight size="s" />
      </WIcon>{" "}
      <WText width="16%" />
    </WRow>
  </WFrame>
);

export default BreadcrumbWireframe;
