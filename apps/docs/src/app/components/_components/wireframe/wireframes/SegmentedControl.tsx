"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
  WText,
} from "@/app/components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const SegmentedControlWireframe: FC = () => (
  <WFrame>
    <WInput className={styles.segmentGroup}>
      <div className={`${styles.segment} ${styles.segmentActive}`}>
        <WText width="50%" />
      </div>
      <div className={styles.segment}>
        <WText width="50%" />
      </div>
      <div className={styles.segment}>
        <WText width="50%" />
      </div>
    </WInput>
  </WFrame>
);

export default SegmentedControlWireframe;
