"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const HeaderNavigationWireframe: FC = () => (
  <WFrame alignItems="center" justifyContent="center">
    <WText width="25%" height={24} />
    <WText width="25%" height={24} />
    <WCircle width={40} height={40} />
  </WFrame>
);

export default HeaderNavigationWireframe;
