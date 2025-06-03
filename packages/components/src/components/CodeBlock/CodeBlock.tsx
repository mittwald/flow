import type { FC } from "react";
import React from "react";
import type { SyntaxHighlighterProps } from "react-syntax-highlighter";
import SyntaxHighlighterNative from "react-syntax-highlighter";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import { CopyButton } from "@/components/CopyButton";
import styles from "./CodeBlock.module.scss";

export interface CodeBlockProps
  extends Omit<SyntaxHighlighterProps, "children">,
    PropsWithClassName {
  /** Adds a copy icon to the code block to copy its content. */
  copyable?: boolean;
  /** The color of the code block. @default "default" */
  color?: "default" | "light" | "dark";
  /** The code to display inside the code block. */
  code: string | string[];
}

// React 19 Types Fix
const SyntaxHighlighter =
  SyntaxHighlighterNative as unknown as React.FC<SyntaxHighlighterProps>;

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
