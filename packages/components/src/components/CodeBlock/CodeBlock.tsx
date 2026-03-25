import type { FC, PropsWithChildren } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./CodeBlock.module.scss";
import { CodeEditor, type CodeEditorProps } from "@/components/CodeEditor";

export interface CodeBlockProps
  extends
    PropsWithClassName,
    PropsWithChildren,
    Pick<CodeEditorProps, "language" | "withLineNumbers" | "copyable"> {
  code?: string;
}

/** @flr-generate all */
export const CodeBlock: FC<CodeBlockProps> = (props) => {
  const {
    code,
    className,
    copyable = false,
    withLineNumbers = false,
    children,
    ...rest
  } = props;

  const rootClassName = clsx(styles.codeBlock, className);

  if (!code) {
    return (
      <div className={clsx(rootClassName, styles.withCodeContent)}>
        <pre>
          <code>{children}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className={rootClassName}>
      <CodeEditor
        value={code}
        copyable={copyable}
        withLineNumbers={withLineNumbers}
        withLinterMarkers={false}
        withCodeFolding={false}
        {...rest}
        isReadOnly
      />
    </div>
  );
};

export default CodeBlock;
