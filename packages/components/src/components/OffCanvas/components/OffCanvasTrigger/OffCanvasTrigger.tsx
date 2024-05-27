import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import { OverlayTrigger } from "@/components/OverlayTrigger";

type Props = PropsWithChildren;

export const OffCanvasTrigger: FC<Props> = (props) => {
  return (
    <OverlayTrigger>
      <Aria.DialogTrigger>{props.children}</Aria.DialogTrigger>
    </OverlayTrigger>
  );
};
