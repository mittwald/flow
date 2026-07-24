"use client";
import type { FC } from "react";
import {
  WFrame,
  WRow,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconStar, IconStarFilled } from "@mittwald/flow-react-components";

export const RatingWireframe: FC = () => (
  <WFrame>
    <WRow justifyContent="center">
      <IconStarFilled />
      <IconStarFilled />
      <IconStarFilled />
      <IconStar />
      <IconStar />
    </WRow>
  </WFrame>
);

export default RatingWireframe;
