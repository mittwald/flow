"use client";
import type { FC } from "react";
import {
  WCircle,
  WFrame,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const HeaderNavigationWireframe: FC = () => (
  <WFrame alignItems="center" justifyContent="center">
    <WText width="18%" />
    <WText width="18%" />
    <WCircle width={32} height={32} />
  </WFrame>
);

export default HeaderNavigationWireframe;
