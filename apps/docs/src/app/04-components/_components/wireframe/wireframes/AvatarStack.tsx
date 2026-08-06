"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
} from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const AvatarStackWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WCircle tone="700" size={64} />
    <WCircle tone="600" size={64} className={styles.avatarOverlap} />
    <WCircle tone="500" size={64} className={styles.avatarOverlap} />
  </WFrame>
);

export default AvatarStackWireframe;
