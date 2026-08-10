"use client";
import type { FC } from "react";
import { WFrame } from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const CartesianChartWireframe: FC = () => (
  <WFrame height="100%" justifyContent="center" alignItems="center">
    <div className={styles.chart}>
      <div className={styles.chartBars}>
        <span style={{ height: "42%" }} />
        <span style={{ height: "70%" }} />
        <span style={{ height: "54%" }} />
        <span style={{ height: "82%" }} />
      </div>
    </div>
  </WFrame>
);

export default CartesianChartWireframe;
