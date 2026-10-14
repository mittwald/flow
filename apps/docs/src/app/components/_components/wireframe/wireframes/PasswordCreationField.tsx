"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WInput,
  WStack,
  WText,
} from "@/app/components/_components/wireframe/primitives";
import { Icon } from "@mittwald/flow-react-components";
import { faAsterisk } from "@fortawesome/sharp-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const PasswordCreationFieldWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WText width="34%" />
      <WInput>
        <WIcon>
          <Icon>
            <FontAwesomeIcon icon={faAsterisk} />
          </Icon>
        </WIcon>
        <WIcon>
          <Icon>
            <FontAwesomeIcon icon={faAsterisk} />
          </Icon>
        </WIcon>
        <WIcon>
          <Icon>
            <FontAwesomeIcon icon={faAsterisk} />
          </Icon>
        </WIcon>
      </WInput>
    </WStack>
  </WFrame>
);

export default PasswordCreationFieldWireframe;
