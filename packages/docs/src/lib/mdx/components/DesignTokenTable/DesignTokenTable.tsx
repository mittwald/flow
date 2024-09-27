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
import { Sample } from "@/lib/mdx/components/DesignTokenTable/Samples/Sample";

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

function getTokens(current: unknown, target: DesignToken[] = []) {
  if (isDesignToken(current)) {
    target.push(current);
  } else if (current !== null && typeof current === "object") {
    for (const value of Object.values(current)) {
      getTokens(value, target);
    }
  }
  return target;
}

export const DesignTokenTable: FC<Props> = (props) => {
  const { path } = props;

  const values = getProperty<unknown, string>(tokens, path, undefined);
  const designTokens = getTokens(values);
  const rows = designTokens.map((token) => {
    console.log(token);
    let tokenName = "";
    token.path.forEach((part, index) => {
      const glue = index === token.path.length - 1 ? "" : "--";
      tokenName += part + glue;
    });
    return (
      <TableRow key={tokenName}>
        <Sample tokenName={tokenName} tokenValue={token.value} />
        <TableCell>{tokenName}</TableCell>
        <TableCell>{token.value}</TableCell>
      </TableRow>
    );
  });

  return (
    <Table>
      <TableHeader>
        <TableColumn>Beispiel</TableColumn>
        <TableColumn>Token-Name</TableColumn>
        <TableColumn>Wert</TableColumn>
      </TableHeader>
      <TableBody>{rows}</TableBody>
    </Table>
  );
};
