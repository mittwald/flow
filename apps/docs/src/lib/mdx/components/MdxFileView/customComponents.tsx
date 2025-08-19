import styles from "./customComponents.module.css";
import { Heading } from "@mittwald/flow-react-components";
import { Alert } from "@mittwald/flow-react-components";
import { Content } from "@mittwald/flow-react-components";
import type { PropsWithChildren } from "react";
import { CopyButton } from "@mittwald/flow-react-components";
import { Link } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { RouterProvider } from "@mittwald/flow-react-components/nextjs";
import ExamplesContainer from "@/lib/mdx/components/DoAndDont/ExamplesContainer";
import { ColumnLayout } from "@mittwald/flow-react-components";
import { InlineCode } from "@mittwald/flow-react-components";
import { Separator } from "@mittwald/flow-react-components";
import { DesignTokenTable } from "@/lib/mdx/components/DesignTokenTable/DesignTokenTable";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { onlyText } from "react-children-utilities";

export const customComponents = {
  Content: Content,
  Heading: Heading,
  Alert: Alert,
  DoAndDont: ExamplesContainer,
  ColumnLayout: ColumnLayout,
  DesignTokenTable: DesignTokenTable,
  Label: Label,
  Link: Link,

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
    <Text className={styles.p} elementType="p">
      {children}
    </Text>
  ),

  ul: ({ children }: PropsWithChildren) => (
    <ul className={styles.ul}>{children}</ul>
  ),

  li: ({ children }: PropsWithChildren) => (
    <li className={styles.li}>{children}</li>
  ),

  h1: ({ children }: PropsWithChildren) => (
    <Heading level={2} size="l" className={styles.heading2}>
      {children}
    </Heading>
  ),

  h2: ({ children }: PropsWithChildren) => (
    <Heading level={3} size="m" className={styles.heading}>
      {children}
    </Heading>
  ),

  h3: ({ children }: PropsWithChildren) => (
    <Heading level={4} size="s" className={styles.heading}>
      {children}
    </Heading>
  ),

  h4: ({ children }: PropsWithChildren) => (
    <Heading level={5} className={styles.heading}>
      {children}
    </Heading>
  ),

  a: ({ children, href }: PropsWithChildren<{ href?: string }>) => {
    if (href?.startsWith("http")) {
      const url = new URL(href);

      return (
        <Link
          href={href}
          inline
          target={
            url.origin === "https://mittwald.github.io" ? undefined : "_blank"
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

  table: ({ children }: PropsWithChildren) => <Table>{children}</Table>,
  thead: ({ children }: PropsWithChildren) => (
    <TableHeader>{children}</TableHeader>
  ),
  tr: ({ children }: PropsWithChildren) => <TableRow>{children}</TableRow>,
  th: ({ children }: PropsWithChildren) => (
    <TableColumn>{children}</TableColumn>
  ),
  tbody: ({ children }: PropsWithChildren) => <TableBody>{children}</TableBody>,
  td: ({ children }: PropsWithChildren) => <TableCell>{children}</TableCell>,
} as const;
