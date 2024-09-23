import type { FC } from "react";
import tokens from "@mittwald/flow-design-tokens/variables.json";
import { pathOr } from "remeda";
import { getProperty } from "dot-prop";

interface Props {
  // "colors.primary"
  path: string;
}

export const DesignTokenTable: FC<Props> = (props) => {
  const { path } = props;

  const values = getProperty<unknown, string>(
    tokens,
    path,
    undefined,
  ) as unknown;
};
