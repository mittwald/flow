import { type FC, type PropsWithChildren, useState } from "react";
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
   * Enables collapsing of long code blocks with a "Show more" toggle. @default:
   * false
   */
  expandable?: boolean;
  /** Line count threshold before the code block is collapsed. @default: 10 */
  expandAfterLines?: number;
}

/** @flr-generate all */
export const CodeBlock: FC<CodeBlockProps> = (props) => {
  const {
    code,
    className,
    copyable = false,
    showLineNumbers = false,
    children,
    expandable = false,
    expandAfterLines = 8,
    ...rest
  } = props;

  const [expanded, setExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number>();
  const [shouldExpand, setShouldExpand] = useState(false);

  const stringFormatter = useLocalizedStringFormatter(locales, "AlertIcon");

  const rootClassName = clsx(styles.codeBlock, className);

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
            expanded || !expandable || !shouldExpand ? "none" : maxHeight,
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

            const visibleLines = expandAfterLines;
            setMaxHeight(lineHeight * visibleLines + padding);

            const totalLines = view.state.doc.lines;
            setShouldExpand(totalLines > visibleLines);
          }}
          id="code-block"
        />
      </div>

      {expandable && shouldExpand && (
        <div
          className={clsx(
            styles.buttonContainer,
            !expanded && styles.collapsed,
          )}
        >
          {!expanded && (
            <Button
              variant="plain"
              color="secondary"
              size="s"
              onPress={() => setExpanded(true)}
              aria-expanded={expanded}
              aria-controls="code-block"
            >
              {stringFormatter.format("codeBlock.showMore")}
            </Button>
          )}

          {expanded && (
            <Button
              variant="plain"
              color="secondary"
              size="s"
              onPress={() => setExpanded(false)}
              aria-expanded={expanded}
              aria-controls="code-block"
            >
              {stringFormatter.format("codeBlock.showLess")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
