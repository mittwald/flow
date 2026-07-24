"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WRow,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconStar, IconStarFilled } from "@mittwald/flow-react-components";

export const RatingWireframe: FC = () => (
  <WFrame>
    <WRow justifyContent="center">
      <WIcon tone="800">
        <IconStarFilled />
      </WIcon>
      <WIcon tone="800">
        <IconStarFilled />
      </WIcon>
      <WIcon tone="800">
        <IconStarFilled />
      </WIcon>
      <WIcon tone="800">
        <IconStar />
      </WIcon>
      <WIcon tone="800">
        <IconStar />
      </WIcon>
    </WRow>
  </WFrame>
);

export default RatingWireframe;
