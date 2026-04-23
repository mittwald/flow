import { type FC, type PropsWithChildren, useId, useState } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./CodeBlock.module.scss";
import { CodeEditor, type CodeEditorProps } from "@/components/CodeEditor";
import { Button } from "@/components/Button";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";
import locales from "./locales/*.locale.json";

export interface CodeBlockProps
  extends
    PropsWithClassName,
    PropsWithChildren,
    Partial<
      Pick<CodeEditorProps, "language" | "showLineNumbers" | "copyable">
    > {
  code?: string;
  /**
   * Controls truncation of long code blocks. `false` disables it, `true`
   * truncates after 8 lines, and a number sets the maximum line count.
   *
   * @default: false
   */
  truncateLines?: boolean | number;
}

/** @flr-generate all */
export const CodeBlock: FC<CodeBlockProps> = (props) => {
  const {
    code,
    className,
    copyable = false,
    showLineNumbers = false,
    children,
    truncateLines = false,
    ...rest
  } = props;

  const [collapsed, setCollapsed] = useState(true);
  const [maxHeight, setMaxHeight] = useState<number>();
  const [shouldCollapse, setShouldCollapse] = useState(false);

  const stringFormatter = useLocalizedStringFormatter(locales, "CodeBlock");

  const rootClassName = clsx(styles.codeBlock, className);

  const id = useId();

  if (!code) {
    return (
      <div className={clsx(rootClassName, styles.withChildren)}>
        <pre>
          <code>{children}</code>
        </pre>
      </div>
    );
  }

  return (
    <div>
      <div
        className={rootClassName}
        style={{
          maxHeight:
            collapsed && truncateLines && shouldCollapse ? maxHeight : "none",
        }}
      >
        <CodeEditor
          {...rest}
          value={code}
          editable={false}
          copyable={copyable}
          showLineNumbers={showLineNumbers}
          showLinterMarkers={false}
          showCodeFolding={false}
          showActiveLineMarker={false}
          isReadOnly
          onCreateEditor={(view) => {
            const lineHeight = 20;
            const padding = 12;

            const visibleLines =
              typeof truncateLines === "number" ? truncateLines : 8;
            setMaxHeight(lineHeight * visibleLines + padding);

            const totalLines = view.state.doc.lines;
            setShouldCollapse(totalLines > visibleLines);
          }}
          id={id}
        />
      </div>

      {truncateLines && shouldCollapse && (
        <div
          className={clsx(
            styles.buttonContainer,
            collapsed && styles.collapsed,
          )}
        >
          <Button
            variant="plain"
            color="secondary"
            size="s"
            onPress={() => setCollapsed((prev) => !prev)}
            aria-expanded={!collapsed}
            aria-controls={id}
          >
            {stringFormatter.format(collapsed ? "showMore" : "showLess")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
