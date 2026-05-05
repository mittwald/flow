import type { FC } from "react";
import React from "react";
import { extractTextFromPath } from "@/app/_lib/extractTextFromPath";

interface Props {
  children: string;
}

export const GroupText: FC<Props> = (props) => {
  const { children } = props;

  return <>{extractTextFromPath(children)}</>;
};
