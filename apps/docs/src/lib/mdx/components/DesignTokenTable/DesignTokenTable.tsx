import type { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDesignTokens,
} from "@mittwald/flow-react-components";
import { Sample } from "@/lib/mdx/components/DesignTokenTable/Samples/Sample";
import {
  collectTokensInPath,
  tokenName,
} from "@/lib/designTokens/collectTokens";

interface Props {
  path: string;
}

export const DesignTokenTable: FC<Props> = (props) => {
  const { path } = props;
  const designTokens = collectTokensInPath(path, useDesignTokens());
  const rows = designTokens.map((token) => {
    const name = tokenName(token);

    return (
      <TableRow key={name}>
        <TableCell>
          <Sample tokenName={name} tokenValue={token.value} />
        </TableCell>
        <TableCell>{name}</TableCell>
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
