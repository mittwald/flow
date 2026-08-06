"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WStack,
} from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";
import { IconImage } from "@mittwald/flow-react-components";

export const ImageCropperWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WStack className={styles.cropperContainer} width="80%">
      <WIcon className={styles.cropperImage} tone="700">
        <IconImage size="l" />
      </WIcon>
      <div className={styles.cropper}>
        <span className={styles.cropperCell} />
        <span className={styles.cropperCell} />
        <span className={styles.cropperCell} />
        <span className={styles.cropperCell} />
        <span className={styles.cropperCell} />
        <span className={styles.cropperCell} />
        <span className={styles.cropperCell} />
        <span className={styles.cropperCell} />
        <span className={styles.cropperCell} />
      </div>
    </WStack>
  </WFrame>
);

export default ImageCropperWireframe;
