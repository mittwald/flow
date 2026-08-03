"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WIcon,
  WOverlay,
  WRow,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconClose } from "@mittwald/flow-react-components";
import styles from "./wireframes.module.scss";

export const ModalWireframe: FC = () => (
  <WFrame>
    <WOverlay>
      <WRow justifyContent="space-between">
        <WText width="52%" />
        <WIcon>
          <IconClose />
        </WIcon>
      </WRow>
      <WText width="86%" />
      <WText width="64%" />
      <WRow className={styles.modalFooter} justifyContent="flex-end">
        <WButton tone="400" width="30%" className={styles.modalFooterButton} />
        <WButton width="30%" className={styles.modalFooterButton} />
      </WRow>
    </WOverlay>
  </WFrame>
);

export default ModalWireframe;
