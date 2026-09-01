"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WIcon,
  WRow,
  WStack,
  WText,
} from "@/app/components/_components/wireframe/primitives";
import { IconChevronDown } from "@mittwald/flow-react-components";
import styles from "@/app/components/_components/wireframe/wireframes/wireframes.module.scss";

export const TabNavigationWireframe: FC = () => (
  <WFrame>
    <WStack gap={0}>
      <WRow className={styles.tabBar} gap={0}>
        <div className={`${styles.tab} ${styles.tabCurrent}`}>
          <WText width="100%" />
        </div>
        <div className={styles.tab}>
          <WText width="100%" />
        </div>
        <div className={styles.tab}>
          <WText width="100%" />
        </div>
        <div className={styles.tab}>
          <WIcon tone="600">
            <IconChevronDown />
          </WIcon>
        </div>
      </WRow>
      <WBox tone="300" className={styles.tabPanel}>
        <WText width="84%" />
        <WText width="58%" />
      </WBox>
    </WStack>
  </WFrame>
);

export default TabNavigationWireframe;
