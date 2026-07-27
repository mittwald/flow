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
      <WIcon>
        <IconStarFilled />
      </WIcon>
      <WIcon>
        <IconStarFilled />
      </WIcon>
      <WIcon>
        <IconStarFilled />
      </WIcon>
      <WIcon>
        <IconStar />
      </WIcon>
      <WIcon>
        <IconStar />
      </WIcon>
    </WRow>
  </WFrame>
);

export default RatingWireframe;
