"use client";
import type { FC } from "react";
import { WFrame } from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const SliderWireframe: FC = () => (
  <WFrame>
    <div className={styles.sliderTrack}>
      <span className={styles.sliderKnob} />
    </div>
  </WFrame>
);

export default SliderWireframe;
