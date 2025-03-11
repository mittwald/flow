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
        {props.children}
      </Link>
    ),
    p: (props) => (
      <Text elementType="p" color={textColor}>
        {props.children}
      </Text>
    ),
    code: (props) => <InlineCode color={color}>{props.children}</InlineCode>,
    h1: (props) => (
      <Heading level={1} color={headingAndLinkColor}>
        {props.children}
      </Heading>
    ),
    h2: (props) => (
      <Heading level={2} color={headingAndLinkColor}>
        {props.children}
      </Heading>
    ),
    h3: (props) => (
      <Heading level={3} color={headingAndLinkColor}>
        {props.children}
      </Heading>
    ),
    h4: (props) => (
      <Heading level={4} color={headingAndLinkColor}>
        {props.children}
      </Heading>
    ),
    h5: (props) => (
      <Heading level={5} color={headingAndLinkColor}>
        {props.children}
      </Heading>
    ),
    h6: (props) => (
      <Heading level={6} color={headingAndLinkColor}>
        {props.children}
      </Heading>
    ),
    hr: () => <Separator />,
    pre: (props) => {
      const preElementContent = Children.toArray(props.children)[0];

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
          code={String(
            isValidElement<{ children: string }>(preElementContent)
              ? preElementContent.props.children
              : preElementContent,
          )}
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
