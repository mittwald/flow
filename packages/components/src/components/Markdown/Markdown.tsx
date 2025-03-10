import { CodeBlock } from "@/components/CodeBlock";
import { Heading } from "@/components/Heading";
import { InlineCode } from "@/components/InlineCode";
import { Link } from "@/components/Link";
import { Separator } from "@/components/Separator";
import { Text } from "@/components/Text";
import type { FC, ReactNode } from "react";
import { Children, isValidElement } from "react";
import type { Components, Options } from "react-markdown";
import ReactMarkdown from "react-markdown";
import styles from "./Markdown.module.scss";

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
    blockquote: (props) => (
      <Text color={textColor}>
        <blockquote>{props.children}</blockquote>
      </Text>
    ),
  };

  return (
    <div className={styles.markdown}>
      <ReactMarkdown {...rest} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
