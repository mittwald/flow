"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
  WText,
} from "@/app/components/_components/wireframe/primitives";

export const HeaderNavigationWireframe: FC = () => (
  <WFrame alignItems="center" justifyContent="center">
    <WText width="25%" height={24} />
    <WText width="25%" height={24} />
    <WCircle size={40} />
  </WFrame>
);

export default HeaderNavigationWireframe;
