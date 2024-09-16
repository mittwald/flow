import type { FC } from "react";
import React from "react";
import type { SyntaxHighlighterProps } from "react-syntax-highlighter";
import SyntaxHighlighter from "react-syntax-highlighter";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import { CopyButton } from "@/components/CopyButton";
import styles from "./CodeBlock.module.scss";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface CodeBlockProps
  extends SyntaxHighlighterProps,
    PropsWithClassName {
  copyable?: boolean;
  color?: "neutral" | "light" | "dark";
}

export const CodeBlock: FC<CodeBlockProps> = (props) => {
  const { children, className, copyable, color = "neutral", ...rest } = props;

  const rootClassName = clsx(styles.codeBlock, styles[color], className);

  return (
    <div className={rootClassName}>
      <SyntaxHighlighter
        customStyle={{
          background: "none",
          padding: "none",
          margin: "none",
        }}
        style={color === "light" ? a11yDark : undefined}
        {...rest}
      >
        {children}
      </SyntaxHighlighter>
      {copyable && (
        <CopyButton
          size="s"
          color={color === "neutral" ? "dark" : color}
          text={children}
        />
      )}
    </div>
  );
};

export default CodeBlock;
