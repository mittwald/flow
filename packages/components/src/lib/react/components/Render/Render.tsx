import type { FC, ReactNode } from "react";

export const Render: FC<{ children: () => ReactNode | void }> = (props) => (
  <>{props.children() ?? null}</>
);
