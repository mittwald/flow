import type { FC } from "react";
import React from "react";
import humanizeString from "humanize-string";

interface Props {
  children: string;
}

export const GroupText: FC<Props> = (props) => {
  const { children } = props;

  return <>{humanizeString(children.replaceAll(/^[0-9]+/g, ""))}</>;
};
