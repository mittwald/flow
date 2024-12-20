import type { FC, PropsWithChildren } from "react";
import React from "react";

export type FragmentProps = PropsWithChildren;

export const Fragment: FC<FragmentProps> = (props) => {
  return <>{props.children}</>;
};

export default Fragment;
