"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
} from "@/app/04-components/_components/wireframe/primitives";
import { Icon } from "@mittwald/flow-react-components";
import { IconLoader2 } from "@tabler/icons-react";

export const ActionWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WBox width="58%" alignItems="center">
      <Icon size="s">
        <IconLoader2 />
      </Icon>
    </WBox>
  </WFrame>
);

export default ActionWireframe;
