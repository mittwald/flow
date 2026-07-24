"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconUpload } from "@mittwald/flow-react-components";

export const FileFieldWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WBox width="fit-content">
      <IconUpload size="s" />
    </WBox>
  </WFrame>
);

export default FileFieldWireframe;
