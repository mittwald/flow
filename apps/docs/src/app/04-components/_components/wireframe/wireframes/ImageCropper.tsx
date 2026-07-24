"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WIcon,
} from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";
import { IconImage } from "@mittwald/flow-react-components";

export const ImageCropperWireframe: FC = () => (
  <WFrame>
    <WBox className={styles.cropper} tone="600">
      <WBox className={styles.cropFrame} alignItems="center">
        <WIcon tone="800">
          <IconImage />
        </WIcon>
      </WBox>
    </WBox>
  </WFrame>
);

export default ImageCropperWireframe;
