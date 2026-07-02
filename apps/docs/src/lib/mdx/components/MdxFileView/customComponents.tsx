import styles from "./customComponents.module.css";
import {
  Alert,
  AlertBadge,
  CodeBlock,
  ColumnLayout,
  Content,
  Heading,
  InlineCode,
  Label,
  Link,
  Separator,
  Text,
} from "@mittwald/flow-react-components";
import { Children, isValidElement, type PropsWithChildren } from "react";
import { RouterProvider } from "@mittwald/flow-react-components/nextjs";
import ExamplesContainer from "@/lib/mdx/components/DoAndDont/ExamplesContainer";
import { DesignTokenTable } from "@/lib/mdx/components/DesignTokenTable/DesignTokenTable";
import { IconLibrary } from "@/lib/mdx/components/IconLibrary/IconLibrary";
import { onlyText } from "react-children-utilities";
import { AnchorLinkHeading } from "@/lib/mdx/components/MdxFileView/AnchorLinkHeading";

export const createCustomComponents = () => {
  let currentH1: string | null = null;

  return {
    Content,
    Heading,
    Alert,
    AlertBadge,
    DoAndDont: ExamplesContainer,
    ColumnLayout,
    DesignTokenTable,
    IconLibrary,
    Label,
    Link,

    pre: ({ children }: PropsWithChildren) => {
      const preElementContent = Children.toArray(children)[0];

      return (
        <CodeBlock
          copyable={true}
          language={
            isValidElement<{ className?: string }>(preElementContent) &&
            preElementContent.props.className
              ? preElementContent.props.className.replace("language-", "")
              : "jsx"
          }
          code={String(
            isValidElement<{ children: string }>(preElementContent)
              ? preElementContent.props.children
              : preElementContent,
          ).trim()}
        />
      );
    },

    code: ({ children }: PropsWithChildren) => (
      <InlineCode>{children}</InlineCode>
    ),

    p: ({ children }: PropsWithChildren) => (
      <Text elementType="p">{children}</Text>
    ),

    ul: ({ children }: PropsWithChildren) => (
      <ul className={styles.ul}>{children}</ul>
    ),

    li: ({ children }: PropsWithChildren) => <li>{children}</li>,

    h1: ({ children }: PropsWithChildren) => {
      const text = onlyText(children);
      currentH1 = text;

      return (
        <AnchorLinkHeading level={2} slugText={text}>
          {children}
        </AnchorLinkHeading>
      );
    },

    h2: ({ children }: PropsWithChildren) => {
      const text = onlyText(children);
      const slugText = currentH1 ? `${currentH1} ${text}` : text;

      return (
        <AnchorLinkHeading level={3} slugText={slugText}>
          {children}
        </AnchorLinkHeading>
      );
    },

    h3: ({ children }: PropsWithChildren) => (
      <Heading level={4}>{children}</Heading>
    ),

    h4: ({ children }: PropsWithChildren) => (
      <Heading level={5}>{children}</Heading>
    ),

    a: ({ children, href }: PropsWithChildren<{ href?: string }>) => {
      if (href?.startsWith("http")) {
        const url = new URL(href);

        return (
          <Link
            href={href}
            inline
            target={
              url.hostname === "mittwald.github.io" ? undefined : "_blank"
            }
          >
            {children}
          </Link>
        );
      }

      return (
        <RouterProvider>
          <Link inline href={href}>
            {children}
          </Link>
        </RouterProvider>
      );
    },

    hr: () => <Separator className={styles.separator} />,

    /**
     * React Aria Components Table throws error during pre-rendering when used
     * in combination with MDX. So we are using vanilla HTML with some Flow
     * classes.
     */
    table: ({ children }: PropsWithChildren) => (
      <table aria-label="Tabelle" className="flow--table">
        {children}
      </table>
    ),
    thead: ({ children }: PropsWithChildren) => (
      <thead className="flow--table--header">{children}</thead>
    ),
    tr: ({ children }: PropsWithChildren) => (
      <tr className="flow--table--row">{children}</tr>
    ),
    th: ({ children }: PropsWithChildren) => (
      <th className="flow--table--column">{children}</th>
    ),
    tbody: ({ children }: PropsWithChildren) => (
      <tbody className="flow--table--body">{children}</tbody>
    ),
    td: ({ children }: PropsWithChildren) => (
      <td className="flow--table--cell">{children}</td>
    ),
  } as const;
};
