"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
} from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const SwitchWireframe: FC = () => (
  <WFrame justifyContent="center">
    <span className={styles.switchTrack}>
      <WCircle
        tone="100"
        width="var(--size-px--m)"
        height="var(--size-px--m)"
      />
    </span>
  </WFrame>
);

export default SwitchWireframe;
