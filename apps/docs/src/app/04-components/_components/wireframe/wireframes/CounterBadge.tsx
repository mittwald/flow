"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
  WIcon,
} from "@/app/04-components/_components/wireframe/primitives";
import { Icon } from "@mittwald/flow-react-components";
import { IconNumber3 } from "@tabler/icons-react";

export const CounterBadgeWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WCircle width={48} height={48} tone="600">
      <WIcon tone="400">
        <Icon>
          <IconNumber3 />
        </Icon>
      </WIcon>
    </WCircle>
  </WFrame>
);

export default CounterBadgeWireframe;
