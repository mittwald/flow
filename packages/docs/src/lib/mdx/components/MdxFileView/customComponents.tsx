import styles from "./customComponents.module.css";
import Heading from "@mittwald/flow-react-components/Heading";
import type { MDXComponents } from "mdx/types";
import Alert from "@mittwald/flow-react-components/Alert";
import Content from "@mittwald/flow-react-components/Content";
import React from "react";
import CopyButton from "@mittwald/flow-react-components/CopyButton";
import Link from "@mittwald/flow-react-components/Link";
import Text from "@mittwald/flow-react-components/Text";
import { LinkProvider } from "@mittwald/flow-react-components/nextjs";
import ExamplesContainer from "@/lib/mdx/components/DoAndDont/ExamplesContainer";
import { IconExternalLink } from "@mittwald/flow-react-components/Icons";
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

export const customComponents: MDXComponents = {
  Content: Content,
  Heading: Heading,
  Alert: Alert,
  DoAndDont: ExamplesContainer,
  ColumnLayout: ColumnLayout,
  DesignTokenTable: DesignTokenTable,
  Label: Label,
  Link: Link,

  pre: ({ children }) => (
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

  code: ({ children }) => <InlineCode>{children}</InlineCode>,

  p: ({ children }) => (
    <Text className={styles.p} elementType="p">
      {children}
    </Text>
  ),

  ul: ({ children }) => <ul className={styles.ul}>{children}</ul>,

  li: ({ children }) => <li className={styles.li}>{children}</li>,

  h1: ({ children }) => (
    <Heading level={2} size="l" className={styles.heading2}>
      {children}
    </Heading>
  ),

  h2: ({ children }) => (
    <Heading level={3} size="m" className={styles.heading}>
      {children}
    </Heading>
  ),

  h3: ({ children }) => (
    <Heading level={4} size="s" className={styles.heading}>
      {children}
    </Heading>
  ),

  h4: ({ children }) => (
    <Heading level={5} className={styles.heading}>
      {children}
    </Heading>
  ),

  a: ({ children, href }) => {
    if (href?.startsWith("http")) {
      return (
        <Link href={href} inline>
          {children}
          <IconExternalLink />
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

  table: ({ children }) => <Table>{children}</Table>,
  thead: ({ children }) => <TableHeader>{children}</TableHeader>,
  tr: ({ children }) => <TableRow>{children}</TableRow>,
  th: ({ children }) => <TableColumn>{children}</TableColumn>,
  tbody: ({ children }) => <TableBody>{children}</TableBody>,
  td: ({ children }) => <TableCell>{children}</TableCell>,
};
