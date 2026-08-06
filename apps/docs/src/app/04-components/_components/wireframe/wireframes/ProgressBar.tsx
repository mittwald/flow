"use client";
import type { FC } from "react";
import { WFrame } from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const ProgressBarWireframe: FC = () => (
  <WFrame justifyContent="center">
    <div className={styles.progressTrack}>
      <span className={styles.progressValue} />
    </div>
  </WFrame>
);

export default ProgressBarWireframe;
