import type { FC } from "react";
import {
  Flex,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components";
import lightDesignTokens from "@mittwald/flow-design-tokens/json-runtime/all-light.json";
import darkDesignTokens from "@mittwald/flow-design-tokens/json-runtime/all-dark.json";
import { Sample } from "@/lib/mdx/components/DesignTokenTable/Samples/Sample";
import {
  collectThemedTokens,
  differsByTheme,
} from "@/lib/designTokens/collectTokens";

interface Props {
  /** One or more comma-separated token paths */
  path: string;
}

const ThemeValue: FC<{ name: string; value: string }> = ({ name, value }) => (
  <Flex align="center" gap="s">
    <Sample tokenName={name} tokenValue={value} />
    {value}
  </Flex>
);

/**
 * Tokens that differ between the themes (Semantic) get a column per theme, so
 * both are visible whichever theme the page is in. Theme-neutral ones (Brand)
 * keep a single value.
 */
export const DesignTokenTable: FC<Props> = (props) => {
  const { path } = props;
  const tokens = collectThemedTokens(path, lightDesignTokens, darkDesignTokens);

  if (differsByTheme(tokens)) {
    return (
      <Table aria-label="Design Tokens">
        <TableHeader>
          <TableColumn>Token-Name</TableColumn>
          <TableColumn>Light</TableColumn>
          <TableColumn>Dark</TableColumn>
        </TableHeader>
        <TableBody>
          {tokens.map((token) => (
            <TableRow key={token.name}>
              <TableCell>{token.name}</TableCell>
              <TableCell>
                <ThemeValue name={token.name} value={token.light} />
              </TableCell>
              <TableCell>
                <ThemeValue
                  name={token.name}
                  value={token.dark ?? token.light}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table aria-label="Design Tokens">
      <TableHeader>
        <TableColumn>Beispiel</TableColumn>
        <TableColumn>Token-Name</TableColumn>
        <TableColumn>Wert</TableColumn>
      </TableHeader>
      <TableBody>
        {tokens.map((token) => (
          <TableRow key={token.name}>
            <TableCell>
              <Sample tokenName={token.name} tokenValue={token.light} />
            </TableCell>
            <TableCell>{token.name}</TableCell>
            <TableCell>{token.light}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
