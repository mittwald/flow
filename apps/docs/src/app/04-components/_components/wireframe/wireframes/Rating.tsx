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
      <WIcon tone="600">
        <IconStarFilled size="l" />
      </WIcon>
      <WIcon tone="600">
        <IconStarFilled size="l" />
      </WIcon>
      <WIcon tone="600">
        <IconStar size="l" />
      </WIcon>
    </WRow>
  </WFrame>
);

export default RatingWireframe;
