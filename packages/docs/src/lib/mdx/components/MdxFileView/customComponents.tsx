import styles from "./customComponents.module.css";
import Heading from "@mittwald/flow-react-components/Heading";
import type { MDXComponents } from "mdx/types";
import InlineAlert from "@mittwald/flow-react-components/InlineAlert";
import Content from "@mittwald/flow-react-components/Content";
import React from "react";
import CopyButton from "@mittwald/flow-react-components/CopyButton";
import Link from "@mittwald/flow-react-components/Link";
import Text from "@mittwald/flow-react-components/Text";
import { LinkProvider } from "@mittwald/flow-react-components/nextjs";
import DoAndDont from "@/lib/mdx/components/DoAndDont/DoAndDont";
import { IconExternalLink } from "@mittwald/flow-react-components/Icons";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";

export const customComponents: MDXComponents = {
  Content: Content,
  Heading: Heading,
  InlineAlert: InlineAlert,
  DoAndDont: DoAndDont,
  ColumnLayout: ColumnLayout,

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

  code: ({ children }) => <code className={styles.code}>{children}</code>,

  p: ({ children }) => (
    <Text className={styles.p} elementType="p">
      {children}
    </Text>
  ),

  ul: ({ children }) => <ul className={styles.ul}>{children}</ul>,

  li: ({ children }) => <li className={styles.li}>{children}</li>,

  h2: ({ children }) => (
    <Heading level={2} className={styles.heading2}>
      {children}
    </Heading>
  ),

  h3: ({ children }) => (
    <Heading level={3} className={styles.heading}>
      {children}
    </Heading>
  ),

  h4: ({ children }) => (
    <Heading level={4} className={styles.heading}>
      {children}
    </Heading>
  ),

  h5: ({ children }) => (
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

  hr: () => <hr className={styles.hr} />,
};
