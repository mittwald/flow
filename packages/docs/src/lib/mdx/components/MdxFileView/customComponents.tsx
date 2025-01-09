import styles from "./customComponents.module.css";
import Heading from "@mittwald/flow-react-components/Heading";
import Alert from "@mittwald/flow-react-components/Alert";
import Content from "@mittwald/flow-react-components/Content";
import type { PropsWithChildren } from "react";
import React from "react";
import CopyButton from "@mittwald/flow-react-components/CopyButton";
import Link from "@mittwald/flow-react-components/Link";
import Text from "@mittwald/flow-react-components/Text";
import { LinkProvider } from "@mittwald/flow-react-components/nextjs";
import ExamplesContainer from "@/lib/mdx/components/DoAndDont/ExamplesContainer";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { InlineCode } from "@mittwald/flow-react-components/InlineCode";
import { Separator } from "@mittwald/flow-react-components/Separator";
import { DesignTokenTable } from "@/lib/mdx/components/DesignTokenTable/DesignTokenTable";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components/Table";
import { Label } from "@mittwald/flow-react-components/Label";

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
        text={children}
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
      return (
        <Link href={href} inline>
          {children}
        </Link>
      );
    }

    return (
      <LinkProvider>
        <Link inline href={href}>
          {children}
        </Link>
      </LinkProvider>
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
