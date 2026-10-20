"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
  WIcon,
} from "@/app/components/_components/wireframe/primitives";
import { Icon } from "@mittwald/flow-react-components";
import { fa3 } from "@fortawesome/sharp-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CounterBadgeWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WCircle size={48} tone="600">
      <WIcon tone="400">
        <Icon>
          <FontAwesomeIcon icon={fa3} />
        </Icon>
      </WIcon>
    </WCircle>
  </WFrame>
);

export default CounterBadgeWireframe;
