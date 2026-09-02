"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
  WStack,
  WText,
} from "@/app/components/_components/wireframe/primitives";
import styles from "@/app/components/_components/wireframe/wireframes/wireframes.module.scss";

export const TabsWireframe: FC = () => (
  <WFrame>
    <WStack gap={16}>
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
      <WStack>
        <WText width="84%" />
        <WText width="58%" />
      </WStack>
    </WStack>
  </WFrame>
);

export default TabsWireframe;
