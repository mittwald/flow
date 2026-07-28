"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import styles from "@/app/04-components/_components/wireframe/wireframes/wireframes.module.scss";

export const TabsWireframe: FC = () => (
  <WFrame>
    <WStack gap={16}>
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
      <WStack>
        <WText width="84%" />
        <WText width="58%" />
      </WStack>
    </WStack>
  </WFrame>
);

export default TabsWireframe;
