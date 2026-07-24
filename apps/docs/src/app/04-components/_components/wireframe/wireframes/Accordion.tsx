"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
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
        <IconChevronDown size="s" />
      </WBox>
      <WBox tone="100" flexDirection="row" justifyContent="space-between">
        <WStack>
          <WText width="50%" />
          <WText width="80%" />
        </WStack>
        <IconChevronUp size="s" />
      </WBox>
    </WStack>
  </WFrame>
);

export default AccordionWireframe;
