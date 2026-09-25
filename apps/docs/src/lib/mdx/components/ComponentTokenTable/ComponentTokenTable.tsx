import type { CSSProperties, FC, PropsWithChildren, ReactNode } from "react";
import {
  hasNamespace,
  isColor,
  loadComponentTokens,
  resolveNamespaces,
  splitByTheme,
} from "@/lib/componentTokens/loadComponentTokens";
import type { ComponentToken } from "@/lib/componentTokens/types";
import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Heading,
} from "@mittwald/flow-react-components";
import styles from "./ComponentTokenTable.module.scss";

interface Props {
  componentName: string;
  /** Comma-separated namespaces, overriding the one derived from the name */
  tokens?: string;
}

const Value: FC<{ value: string }> = ({ value }) => (
  <span className={styles.value}>
    {isColor(value) && (
      <span
        aria-hidden
        className={styles.swatch}
        style={{ backgroundColor: value }}
      />
    )}
    {value}
  </span>
);

/** The tokens a token references on its way to the value, indented per step. */
const ReferenceChain: FC<{ token: ComponentToken }> = ({ token }) => {
  const steps = [
    token.name,
    ...(token.references ?? []),
    ...(token.expression ? [token.expression] : []),
  ];

  return (
    <ContextualHelpTrigger subject={token.name}>
      <Button color="secondary" />
      <ContextualHelp>
        <ol className={styles.chain}>
          {steps.map((step, depth) => (
            <li
              key={step}
              style={{ "--depth": depth } as CSSProperties}
              className={styles.step}
            >
              {depth > 0 && <span aria-hidden>↳</span>}
              <code className="flow--inline-code">{step}</code>
            </li>
          ))}
        </ol>
      </ContextualHelp>
    </ContextualHelpTrigger>
  );
};

const Cell: FC<PropsWithChildren> = ({ children }) => (
  <td className="flow--table--cell">{children}</td>
);

const TokenTable: FC<{
  heading: string;
  columns: string[];
  tokens: ComponentToken[];
  renderValues: (token: ComponentToken) => ReactNode;
}> = ({ heading, columns, tokens, renderValues }) => (
  <div className={styles.group}>
    <Heading level={4}>{heading}</Heading>
    <div className={styles.scrollContainer}>
      <table aria-label={heading} className="flow--table">
        <thead className="flow--table--header">
          <tr className="flow--table--row">
            {columns.map((column) => (
              <th className="flow--table--column" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="flow--table--body">
          {tokens.map((token) => (
            <tr className="flow--table--row" key={token.name}>
              <Cell>
                <span className={styles.nameCell}>
                  <code className={`flow--inline-code ${styles.name}`}>
                    {token.name}
                  </code>
                  {(token.references || token.expression) && (
                    <ReferenceChain token={token} />
                  )}
                </span>
              </Cell>
              {renderValues(token)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/**
 * Plain HTML tables like the MDX tables in `customComponents` — React Aria's
 * Table throws while pre-rendering inside MDX.
 */
export const ComponentTokenTable: FC<Props> = ({ componentName, tokens }) => {
  const namespaces = resolveNamespaces(componentName, tokens);
  const missing = namespaces.filter((namespace) => !hasNamespace(namespace));
  if (missing.length > 0) {
    throw new Error(
      `ComponentTokenTable (${componentName}): no token namespace ${missing.join(", ")}`,
    );
  }
  const { single, perTheme } = splitByTheme(loadComponentTokens(namespaces));

  return (
    <div className={styles.tables}>
      {single.length > 0 && (
        <TokenTable
          heading="Größen & Stile"
          columns={["Token", "Wert"]}
          tokens={single}
          renderValues={(token) => (
            <Cell>
              <Value value={token.light} />
            </Cell>
          )}
        />
      )}
      {perTheme.length > 0 && (
        <TokenTable
          heading="Farben"
          columns={["Token", "Light", "Dark"]}
          tokens={perTheme}
          renderValues={(token) => (
            <>
              <Cell>
                <Value value={token.light} />
              </Cell>
              <Cell>
                <Value value={token.dark ?? token.light} />
              </Cell>
            </>
          )}
        />
      )}
    </div>
  );
};
