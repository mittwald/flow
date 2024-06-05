import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import { OverlayTrigger } from "@/components/OverlayTrigger";

type Props = PropsWithChildren;

export const ContextMenuTrigger: FC<Props> = (props) => {
  return (
    <OverlayTrigger>
      <Aria.MenuTrigger>{props.children}</Aria.MenuTrigger>
    </OverlayTrigger>
  );
};
