"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WInput,
} from "@/app/components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";
import { IconUpload } from "@mittwald/flow-react-components";

export const FileDropZoneWireframe: FC = () => (
  <WFrame>
    <WInput
      className={styles.dropZone}
      justifyContent="center"
      alignItems="center"
    >
      <WIcon size={64}>
        <IconUpload />
      </WIcon>
    </WInput>
  </WFrame>
);

export default FileDropZoneWireframe;
