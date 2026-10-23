"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WIcon,
} from "@/app/components/_components/wireframe/primitives";
import { Icon } from "@mittwald/flow-react-components";
import { faCommand } from "@fortawesome/sharp-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const KbdWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WBox width="fit-content">
      <WIcon>
        <Icon>
          <FontAwesomeIcon icon={faCommand} />
        </Icon>
      </WIcon>
    </WBox>
  </WFrame>
);

export default KbdWireframe;
