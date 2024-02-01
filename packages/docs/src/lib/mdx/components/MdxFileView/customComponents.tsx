import styles from "./customComponents.module.css";
import Heading from "@mittwald/flow-next-components/Heading";
import { MDXComponents } from "mdx/types";

export const customComponents: MDXComponents = {
  pre: ({ children }) => <pre className={styles.pre}>{children}</pre>,

  code: ({ children }) => <code className={styles.code}>{children}</code>,

  p: ({ children }) => <p className={styles.p}>{children}</p>,

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
