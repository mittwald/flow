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
import { ColorSample } from "@/lib/mdx/components/DesignTokenTable/Samples/ColorSample";

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
        {tokenName.includes("color") && (
          <TableCell>
            <ColorSample value={token.value} />
          </TableCell>
        )}
        <TableCell>{tokenName}</TableCell>
        <TableCell>{token.value}</TableCell>
      </TableRow>
    );
  });

  return (
    <Table>
      <TableHeader>
        {path.includes("color") && <TableColumn>Beispiel</TableColumn>}
        <TableColumn>Token-Name</TableColumn>
        <TableColumn>Wert</TableColumn>
      </TableHeader>
      <TableBody>{rows}</TableBody>
    </Table>
  );
};
