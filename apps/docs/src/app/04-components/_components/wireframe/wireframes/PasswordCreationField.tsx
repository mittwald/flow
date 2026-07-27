"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WInput,
} from "@/app/04-components/_components/wireframe/primitives";
import { Icon } from "@mittwald/flow-react-components";
import { IconAsterisk } from "@tabler/icons-react";

export const PasswordCreationFieldWireframe: FC = () => (
  <WFrame>
    <WInput>
      <WIcon>
        <Icon>
          <IconAsterisk />
        </Icon>
      </WIcon>
      <WIcon>
        <Icon>
          <IconAsterisk />
        </Icon>
      </WIcon>{" "}
      <WIcon>
        <Icon>
          <IconAsterisk />
        </Icon>
      </WIcon>
    </WInput>
  </WFrame>
);

export default PasswordCreationFieldWireframe;
