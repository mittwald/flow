"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
} from "@/app/components/_components/wireframe/primitives";
import { faPalette } from "@fortawesome/sharp-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "@mittwald/flow-react-components";

export const ColorWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WIcon size={64}>
      <Icon>
        <FontAwesomeIcon icon={faPalette} />
      </Icon>
    </WIcon>
  </WFrame>
);

export default ColorWireframe;
