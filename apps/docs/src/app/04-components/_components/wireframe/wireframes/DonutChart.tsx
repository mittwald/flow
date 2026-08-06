"use client";
import type { FC } from "react";
import { WFrame } from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const DonutChartWireframe: FC = () => (
  <WFrame justifyContent="center">
    <div className={styles.donut} />
  </WFrame>
);

export default DonutChartWireframe;
