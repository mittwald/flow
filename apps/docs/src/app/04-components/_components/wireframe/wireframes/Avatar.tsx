"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
  WIcon,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconUser } from "@mittwald/flow-react-components";
import styles from "./wireframes.module.scss";

export const AvatarWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WCircle tone="600" size={72}>
      <WIcon tone="400" className={styles.iconReduced}>
        <IconUser size="l" />
      </WIcon>
    </WCircle>
  </WFrame>
);

export default AvatarWireframe;
