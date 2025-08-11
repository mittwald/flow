import type { FC } from "react";
import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import { CopyButton } from "@/components/CopyButton";
import styles from "./CodeBlock.module.scss";

export interface CodeBlockProps extends PropsWithClassName {
  /** Adds a copy icon to the code block to copy its content. */
  copyable?: boolean;
  /** The color of the code block. @default "default" */
  color?: "default" | "light" | "dark";
  /** The code to display inside the code block. */
  code: string | string[];

  // ATTENTION
  // we reexport by copy the props here - react-typescript-docgen
  // will not correctly export the props from react-syntax-highlighter
  // when using OMIT duo some wired circumstances how react-syntax-highlighter
  // exports his types - the following types are excluded
  //
  // children: string | string[];
  //
  language?: string | undefined;
  style?: Record<string, React.CSSProperties> | undefined;
  customStyle?: React.CSSProperties | undefined;
  codeTagProps?: React.HTMLProps<HTMLElement> | undefined;
  useInlineStyles?: boolean | undefined;
  showLineNumbers?: boolean | undefined;
  showInlineLineNumbers?: boolean | undefined;
  startingLineNumber?: number | undefined;
  lineNumberContainerStyle?: React.CSSProperties | undefined;
  lineNumberStyle?: React.CSSProperties | lineNumberStyleFunction | undefined;
  wrapLines?: boolean | undefined;
  wrapLongLines?: boolean | undefined;
  lineProps?: lineTagPropsFunction | React.HTMLProps<HTMLElement> | undefined;
  renderer?: (props: rendererProps) => React.ReactNode;
  PreTag?:
    | keyof React.JSX.IntrinsicElements
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | React.ComponentType<any>
    | undefined;
  CodeTag?:
    | keyof React.JSX.IntrinsicElements
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | React.ComponentType<any>
    | undefined;
}

/** @flr-generate all */
export const CodeBlock: FC<CodeBlockProps> = (props) => {
  const { code, className, copyable, color = "default", ...rest } = props;

  const rootClassName = clsx(styles.codeBlock, styles[color], className);

  return (
    <div className={rootClassName}>
      <SyntaxHighlighter
        customStyle={{
          background: "none",
          padding: "none",
          margin: "none",
        }}
        useInlineStyles={false}
        {...rest}
      >
        {code}
      </SyntaxHighlighter>
      {copyable && (
        <CopyButton
          className={styles.copyButton}
          size="s"
          color={color === "default" ? "dark" : color}
          text={Array.isArray(code) ? code.join("\r\n") : code}
        />
      )}
    </div>
  );
};

export default CodeBlock;
