"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const SegmentedControlWireframe: FC = () => (
  <WFrame>
    <WInput className={styles.segmentGroup}>
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className={`${styles.segment} ${item === 0 ? styles.segmentActive : ""}`}
        >
          <WText width="50%" />
        </div>
      ))}
    </WInput>
  </WFrame>
);

export default SegmentedControlWireframe;
