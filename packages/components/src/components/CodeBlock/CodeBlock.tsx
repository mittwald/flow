import type { FC } from "react";
import React from "react";
import type { SyntaxHighlighterProps } from "react-syntax-highlighter";
import SyntaxHighlighter from "react-syntax-highlighter";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import { CopyButton } from "@/components/CopyButton";
import styles from "./CodeBlock.module.scss";

export interface CodeBlockProps
  extends Omit<SyntaxHighlighterProps, "children">,
    PropsWithClassName {
  copyable?: boolean;
  color?: "default" | "light" | "dark";
  code: string | string[];
}

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
          text={code}
        />
      )}
    </div>
  );
};

export default CodeBlock;
