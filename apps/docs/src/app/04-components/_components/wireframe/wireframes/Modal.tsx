"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WOverlay,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const ModalWireframe: FC = () => (
  <WFrame scale={0.78}>
    <WOverlay>
      <WText width="52%" />
      <WText width="86%" />
      <WText width="64%" />
      <WRow className={styles.modalFooter} justifyContent="space-between">
        <WButton
          tone="500"
          width="30%"
          className={styles.modalFooterButton}
          hideLabel
        />
        <WButton width="30%" className={styles.modalFooterButton} hideLabel />
      </WRow>
    </WOverlay>
  </WFrame>
);

export default ModalWireframe;
