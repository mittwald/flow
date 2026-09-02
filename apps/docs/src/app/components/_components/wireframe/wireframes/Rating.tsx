"use client";
import type { FC } from "react";
import {
  WFrame,
  WIcon,
  WRow,
} from "@/app/components/_components/wireframe/primitives";
import { IconStar, IconStarFilled } from "@mittwald/flow-react-components";

export const RatingWireframe: FC = () => (
  <WFrame>
    <WRow justifyContent="center">
      <WIcon tone="600" size={56}>
        <IconStarFilled />
      </WIcon>
      <WIcon tone="600" size={56}>
        <IconStarFilled />
      </WIcon>
      <WIcon tone="600" size={56}>
        <IconStar />
      </WIcon>
    </WRow>
  </WFrame>
);

export default RatingWireframe;
