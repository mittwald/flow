"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WOverlay,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const TooltipWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack alignItems="center" width={200} gap={0}>
      <WOverlay tipped>
        <WText tone="300" />
      </WOverlay>
      <span className={styles.tipDown} />
      <WButton width="80%" marginBlock={8} />
    </WStack>
  </WFrame>
);

export default TooltipWireframe;
