"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
} from "@/app/components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const SwitchWireframe: FC = () => (
  <WFrame justifyContent="center">
    <span className={styles.switchTrack}>
      <WCircle tone="200" size={16} />
    </span>
  </WFrame>
);

export default SwitchWireframe;
