"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WIcon,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconUpload } from "@mittwald/flow-react-components";

export const FileFieldWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WButton width="fit-content">
      <WIcon tone="400">
        <IconUpload />
      </WIcon>
    </WButton>
  </WFrame>
);

export default FileFieldWireframe;
