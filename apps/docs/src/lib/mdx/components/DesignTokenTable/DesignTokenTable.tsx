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
} from "@mittwald/flow-react-components";
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

function getTokens(current: unknown, collector: DesignToken[] = []) {
  if (isDesignToken(current)) {
    collector.push(current);
  } else if (current !== null && typeof current === "object") {
    for (const value of Object.values(current)) {
      getTokens(value, collector);
    }
  }
  return collector;
}

function recursiveGetTokensInPath(path: string) {
  const values = getProperty<unknown, string>(tokens, path, undefined);
  return getTokens(values);
}

export const DesignTokenTable: FC<Props> = (props) => {
  const { path } = props;

  const designTokens = recursiveGetTokensInPath(path);
  const rows = designTokens.map((token) => {
    const tokenName = token.path.join("--");

    return (
      <TableRow key={tokenName}>
        <TableCell>
          <Sample tokenName={tokenName} tokenValue={token.value} />
        </TableCell>
        <TableCell>{tokenName}</TableCell>
        <TableCell>{token.value}</TableCell>
      </TableRow>
    );
  });

  return (
    <Table aria-label="Design Tokens">
      <TableHeader>
        <TableColumn>Beispiel</TableColumn>
        <TableColumn>Token-Name</TableColumn>
        <TableColumn>Wert</TableColumn>
      </TableHeader>
      <TableBody>{rows}</TableBody>
    </Table>
  );
};
