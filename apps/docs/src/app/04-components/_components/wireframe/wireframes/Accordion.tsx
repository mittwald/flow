"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WIcon,
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
      <WBox tone="100" flexDirection="row" justifyContent="space-between">
        <WText width="40%" />
        <WIcon tone="800">
          <IconChevronDown size="s" />
        </WIcon>
      </WBox>
      <WBox tone="100" flexDirection="row" justifyContent="space-between">
        <WStack>
          <WText width="50%" />
          <WText width="80%" />
        </WStack>
        <WIcon tone="800">
          <IconChevronUp size="s" />
        </WIcon>
      </WBox>
    </WStack>
  </WFrame>
);

export default AccordionWireframe;
