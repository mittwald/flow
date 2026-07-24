"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
} from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const AvatarStackWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WCircle
      tone="700"
      width="var(--size-px--xxl)"
      height="var(--size-px--xxl)"
    />
    <WCircle
      tone="500"
      width="var(--size-px--xxl)"
      height="var(--size-px--xxl)"
      className={styles.avatarOverlap}
    />
    <WCircle
      tone="300"
      width="var(--size-px--xxl)"
      height="var(--size-px--xxl)"
      className={styles.avatarOverlap}
    />
  </WFrame>
);

export default AvatarStackWireframe;
