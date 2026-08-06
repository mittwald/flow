"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WIcon,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconImage } from "@mittwald/flow-react-components";

export const ImageWireframe: FC = () => (
  <WFrame justifyContent="center">
    <WBox width="fit-content">
      <WIcon size={64}>
        <IconImage />
      </WIcon>
    </WBox>
  </WFrame>
);

export default ImageWireframe;
