"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WRow,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconChevronDown } from "@mittwald/flow-react-components";
import styles from "@/app/04-components/_components/wireframe/wireframes/wireframes.module.scss";

export const TabNavigationWireframe: FC = () => (
  <WFrame>
    <WStack gap={16}>
      <WRow className={styles.tabBar} gap={0}>
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className={`${styles.tab} ${item === 0 ? styles.tabCurrent : ""}`}
          >
            <WText width="100%" />
          </div>
        ))}
        <div className={styles.tab}>
          <WIcon tone="600">
            <IconChevronDown />
          </WIcon>
        </div>
      </WRow>
      <WStack>
        <WText width="84%" />
        <WText width="58%" />
      </WStack>
    </WStack>
  </WFrame>
);

export default TabNavigationWireframe;
