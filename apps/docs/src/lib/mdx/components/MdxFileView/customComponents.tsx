import styles from "./customComponents.module.css";
import {
  Alert,
  AlertBadge,
  ColumnLayout,
  Content,
  CopyButton,
  Heading,
  InlineCode,
  Label,
  Link,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Text,
} from "@mittwald/flow-react-components";
import type { PropsWithChildren } from "react";
import { RouterProvider } from "@mittwald/flow-react-components/nextjs";
import ExamplesContainer from "@/lib/mdx/components/DoAndDont/ExamplesContainer";
import { DesignTokenTable } from "@/lib/mdx/components/DesignTokenTable/DesignTokenTable";
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
    Label,
    Link,

    pre: ({ children }: PropsWithChildren) => (
      <div className={styles.preContainer}>
        <pre className={styles.pre}>{children}</pre>
        <CopyButton
          className={styles.preCopyButton}
          text={onlyText(children)}
          variant="plain"
          size="s"
        />
      </div>
    ),

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

    table: ({ children }: PropsWithChildren) => (
      <Table aria-label="Tabelle">{children}</Table>
    ),
    thead: ({ children }: PropsWithChildren) => (
      <TableHeader>{children}</TableHeader>
    ),
    tr: ({ children }: PropsWithChildren) => <TableRow>{children}</TableRow>,
    th: ({ children }: PropsWithChildren) => (
      <TableColumn>{children}</TableColumn>
    ),
    tbody: ({ children }: PropsWithChildren) => (
      <TableBody>{children}</TableBody>
    ),
    td: ({ children }: PropsWithChildren) => <TableCell>{children}</TableCell>,
  } as const;
};
