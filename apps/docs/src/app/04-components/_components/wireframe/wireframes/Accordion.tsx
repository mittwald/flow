"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WIcon,
  WRow,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import {
  IconChevronUp,
  IconChevronDown,
} from "@mittwald/flow-react-components";

export const AccordionWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WBox
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <WText width="40%" />
        <WIcon>
          <IconChevronDown />
        </WIcon>
      </WBox>
      <WBox>
        <WRow
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <WText width="50%" />
          <WIcon>
            <IconChevronUp />
          </WIcon>
        </WRow>
        <WText width="80%" />
      </WBox>
    </WStack>
  </WFrame>
);

export default AccordionWireframe;
