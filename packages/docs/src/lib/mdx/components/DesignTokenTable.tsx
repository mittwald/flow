import type { FC } from "react";
import tokens from "@mittwald/flow-design-tokens/variables.json";
import { getProperty } from "dot-prop";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components/Table";

interface Props {
  path: string;
}

interface DesignToken {
  path: string[];
  value: string;
}

function isDesignToken(ref: unknown): ref is DesignToken {
  return (
    typeof ref === "object" && ref !== null && "path" in ref && "value" in ref
  );
}

function traverseAndCheck(current: unknown, target: DesignToken[] = []) {
  if (isDesignToken(current)) {
    target.push(current);
  } else if (current !== null && typeof current === "object") {
    for (const value of Object.values(current)) {
      traverseAndCheck(value, target);
    }
  }
  return target;
}

export const DesignTokenTable: FC<Props> = (props) => {
  const { path } = props;

  const values = getProperty<unknown, string>(tokens, path, undefined);
  const designTokens = traverseAndCheck(values);
  const rows = designTokens.map((token) => {
    let tokenName = "";
    token.path.forEach((part, index) => {
      const glue = index === token.path.length - 1 ? "" : "--";
      tokenName += part + glue;
    });
    return (
      <TableRow key={tokenName}>
        <TableCell>{tokenName}</TableCell>
        <TableCell>{token.value}</TableCell>
      </TableRow>
    );
  });

  return (
    <Table>
      <TableHeader>
        <TableColumn>Token-Name</TableColumn>
        <TableColumn>Wert</TableColumn>
      </TableHeader>
      <TableBody>{rows}</TableBody>
    </Table>
  );
};
