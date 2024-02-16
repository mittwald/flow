import styles from "./customComponents.module.css";
import Heading from "@mittwald/flow-react-components/Heading";
import { MDXComponents } from "mdx/types";
import InlineAlert from "@mittwald/flow-react-components/InlineAlert";
import Content from "@mittwald/flow-react-components/Content";
import React, { Children, isValidElement } from "react";
import CopyToClipboardButton from "@mittwald/flow-react-components/CopyToClipboardButton";

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

  ul: ({ children }) => <ul className={styles.ul}>{children}</ul>,

  li: ({ children }) => <li className={styles.li}>{children}</li>,

  blockquote: ({ children }) => (
    <InlineAlert>
      <Heading>{Children.toArray(children).find(isValidElement)}</Heading>
      <Content>
        {Children.toArray(children).filter(isValidElement).slice(1)}
      </Content>
    </InlineAlert>
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
