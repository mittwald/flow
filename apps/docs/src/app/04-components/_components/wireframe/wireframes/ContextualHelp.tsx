"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WOverlay,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconInfo } from "@mittwald/flow-react-components";
import styles from "./wireframes.module.scss";

export const ContextualHelpWireframe: FC = () => (
  <WFrame alignItems="center" gap={0}>
    <WIcon>
      <IconInfo />
    </WIcon>
    <span className={styles.tipInlineStart} />
    <WOverlay tipped>
      <WText width="70%" tone="300" />
      <WText tone="300" />
    </WOverlay>
  </WFrame>
);

export default ContextualHelpWireframe;
