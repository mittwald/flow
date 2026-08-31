"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WIcon,
} from "@/app/components/_components/wireframe/primitives";
import { Icon } from "@mittwald/flow-react-components";
import { IconLoader2 } from "@tabler/icons-react";

export const ActionWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WButton width="58%" justifyContent="center">
      <WIcon tone="300">
        <Icon>
          <IconLoader2 />
        </Icon>
      </WIcon>
    </WButton>
  </WFrame>
);

export default ActionWireframe;
