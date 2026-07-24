"use client";
import type { FC } from "react";
import {
  WFrame,
  WInput,
} from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";
import { IconUpload } from "@mittwald/flow-react-components";

export const FileDropZoneWireframe: FC = () => (
  <WFrame>
    <WInput
      className={styles.dropZone}
      justifyContent="center"
      alignItems="center"
    >
      <IconUpload size="l" />
    </WInput>
  </WFrame>
);

export default FileDropZoneWireframe;
