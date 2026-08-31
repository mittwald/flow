"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WRow,
  WText,
} from "@/app/components/_components/wireframe/primitives";
import { IconChevronRight } from "@mittwald/flow-react-components";

export const BreadcrumbWireframe: FC = () => (
  <WFrame>
    <WRow>
      <WText width="22%" />
      <WIcon>
        <IconChevronRight />
      </WIcon>
      <WText width="26%" />
      <WIcon>
        <IconChevronRight />
      </WIcon>
      <WText width="16%" />
    </WRow>
  </WFrame>
);

export default BreadcrumbWireframe;
