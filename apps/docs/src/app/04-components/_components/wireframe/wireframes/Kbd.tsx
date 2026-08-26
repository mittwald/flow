"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WIcon,
} from "@/app/04-components/_components/wireframe/primitives";
import { Icon } from "@mittwald/flow-react-components";
import { IconCommand } from "@tabler/icons-react";

export const KbdWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WBox width="fit-content">
      <WIcon>
        <Icon>
          <IconCommand />
        </Icon>
      </WIcon>
    </WBox>
  </WFrame>
);

export default KbdWireframe;
