import type { FC, ReactNode } from "react";
import React, { Children, isValidElement } from "react";
import type { Components, Options } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Link } from "@/components/Link";
import { Text } from "@/components/Text";
import styles from "./Markdown.module.scss";
import { InlineCode } from "@/components/InlineCode";
import { Heading } from "@/components/Heading";
import { Separator } from "@/components/Separator";
import { CodeBlock } from "@/components/CodeBlock";

export interface MarkdownProps extends Omit<Options, "components"> {
  /** The color schema of the markdown component. */
  color?: "dark" | "light" | "default";
}

/** @flr-generate all */
export const Markdown: FC<MarkdownProps> = (props) => {
  const { children, color = "default", ...rest } = props;

  const headingAndLinkColor = color === "default" ? "primary" : color;
  const textColor = color === "default" ? undefined : color;

  const components: Components = {
    a: (props) => (
      <Link target="_blank" color={headingAndLinkColor} href={props.href}>
        {props.children as ReactNode}
      </Link>
    ),
    p: (props) => (
      <Text elementType="p" className={styles.text} color={textColor}>
        {props.children as ReactNode}
      </Text>
    ),
    code: (props) => (
      <InlineCode color={color}>{props.children as ReactNode}</InlineCode>
    ),
    h1: (props) => (
      <Heading className={styles.heading} level={1} color={headingAndLinkColor}>
        {props.children as ReactNode}
      </Heading>
    ),
    h2: (props) => (
      <Heading className={styles.heading} level={2} color={headingAndLinkColor}>
        {props.children as ReactNode}
      </Heading>
    ),
    h3: (props) => (
      <Heading className={styles.heading} level={3} color={headingAndLinkColor}>
        {props.children as ReactNode}
      </Heading>
    ),
    h4: (props) => (
      <Heading className={styles.heading} level={4} color={headingAndLinkColor}>
        {props.children as ReactNode}
      </Heading>
    ),
    h5: (props) => (
      <Heading className={styles.heading} level={5} color={headingAndLinkColor}>
        {props.children as ReactNode}
      </Heading>
    ),
    h6: (props) => (
      <Heading className={styles.heading} level={6} color={headingAndLinkColor}>
        {props.children as ReactNode}
      </Heading>
    ),
    hr: () => <Separator />,
    pre: (props) => {
      const preElementContent = Children.toArray(
        props.children as ReactNode,
      )[0];

      if (!(typeof preElementContent === "string")) {
        throw new Error("Element must be a string");
      }

      return (
        <CodeBlock
          copyable={false}
          color={color}
          language={
            isValidElement<{ className?: string }>(preElementContent) &&
            preElementContent.props.className
              ? preElementContent.props.className.replace("language-", "")
              : undefined
          }
          code={
            isValidElement<{ children: string }>(preElementContent)
              ? preElementContent.props.children
              : preElementContent
          }
        />
      );
    },
    ul: (props) => (
      <Text color={textColor}>
        <ul>{props.children as ReactNode}</ul>
      </Text>
    ),
    ol: (props) => (
      <Text color={textColor}>
        <ol>{props.children as ReactNode}</ol>
      </Text>
    ),
  };

  return (
    <ReactMarkdown
      {...rest}
      components={components}
      className={styles.markdown}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
