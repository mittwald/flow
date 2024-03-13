import styles from "./customComponents.module.css";
import Heading from "@mittwald/flow-react-components/Heading";
import { MDXComponents } from "mdx/types";
import InlineAlert from "@mittwald/flow-react-components/InlineAlert";
import Content from "@mittwald/flow-react-components/Content";
import React from "react";
import CopyButton from "@mittwald/flow-react-components/CopyButton";

export const customComponents: MDXComponents = {
  Content: Content,
  Heading: Heading,
  InlineAlert: InlineAlert,

  pre: ({ children }) => (
    <div className={styles.preContainer}>
      <pre className={styles.pre}>{children}</pre>
      <CopyButton
        className={styles.preCopyButton}
        text={children}
        style="plain"
        size="s"
      />
    </div>
  ),

  code: ({ children }) => <code className={styles.code}>{children}</code>,

  p: ({ children }) => <p className={styles.p}>{children}</p>,

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
};
