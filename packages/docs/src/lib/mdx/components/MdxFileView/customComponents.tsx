import styles from "./customComponents.module.css";
import Heading from "@mittwald/flow-next-components/Heading";
import { MDXComponents } from "mdx/types";
import Note from "@mittwald/flow-next-components/Note";
import Content from "@mittwald/flow-next-components/Content";
import React, { Children, isValidElement } from "react";
import CopyToClipboardButton from "@mittwald/flow-next-components/CopyToClipboardButton";

export const customComponents: MDXComponents = {
  pre: ({ children }) => (
    <div className={styles.preContainer}>
      <pre className={styles.pre}>{children}</pre>
      <CopyToClipboardButton
        className={styles.preCopyButton}
        text={children}
        variant="plain"
        small
      />
    </div>
  ),

  code: ({ children }) => <code className={styles.code}>{children}</code>,

  p: ({ children }) => <p className={styles.p}>{children}</p>,

  blockquote: ({ children }) => (
    <Note>
      <Heading>{Children.toArray(children).find(isValidElement)}</Heading>
      <Content>
        {Children.toArray(children).filter(isValidElement).slice(1)}
      </Content>
    </Note>
  ),

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
