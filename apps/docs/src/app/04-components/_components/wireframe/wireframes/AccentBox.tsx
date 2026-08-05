"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const AccentBoxWireframe: FC = () => (
  <WFrame className={styles.scale84}>
    <WStack>
      <WBox tone="400">
        <WText width="60%" />
        <WText width="100%" />
      </WBox>
      <WBox tone="600">
        <WText width="50%" />
        <WText width="80%" />
      </WBox>
    </WStack>
  </WFrame>
);

export default AccentBoxWireframe;
