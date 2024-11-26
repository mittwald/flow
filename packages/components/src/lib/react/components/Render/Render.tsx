import type { FC, ReactNode } from "react";
import React from "react";

export const Render: FC<{ children: () => ReactNode | void }> = (props) => (
  <>{props.children() ?? null}</>
);
