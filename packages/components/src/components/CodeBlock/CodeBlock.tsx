import {
  type FC,
  type PropsWithChildren,
  useId,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
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
  /** The code displayed in the block. */
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

  const [folded, setFolded] = useState(truncateLines !== false);
  const [maxHeight, setMaxHeight] = useState<number>();
  /* The full height, only while the toggle animates to or from it. */
  const [expandedHeight, setExpandedHeight] = useState<number>();
  const contentRef = useRef<HTMLElement>(null);

  const stringFormatter = useLocalizedStringFormatter(locales, "CodeBlock");

  const rootClassName = clsx(styles.codeBlock, className);

  const id = useId();

  if (!code) {
    return (
      <div className={clsx(rootClassName, styles.withChildren)}>
        {/* Deliberately class-less: a `flow--` class would make the global
            reset's `font: inherit` apply and replace the UA monospace
            metrics. See CodeBlock.module.scss. */}
        <pre>
          <code>{children}</code>
        </pre>
      </div>
    );
  }

  const heightVariables = {
    ...(maxHeight ? { "--max-height": `${maxHeight}px` } : {}),
    ...(expandedHeight
      ? { "--expanded-max-height": `${expandedHeight}px` }
      : {}),
  } as React.CSSProperties;

  /* A height transition needs a length on both ends – `none` does not
     interpolate. So the full height is measured for the transition and
     released once it ended, and code that changes later is not clipped. */
  const toggleFolded = () => {
    const content = contentRef.current;

    if (!content) {
      setFolded((folded) => !folded);
      return;
    }

    const animates = getComputedStyle(content)
      .transitionDuration.split(",")
      .some((duration) => parseFloat(duration) > 0);

    if (folded) {
      setExpandedHeight(animates ? content.scrollHeight : undefined);
      setFolded(false);
    } else {
      flushSync(() => setExpandedHeight(content.scrollHeight));
      // Applies the start height before the folded one replaces it.
      content.getBoundingClientRect();
      setFolded(true);
    }
  };

  return (
    <div
      className={clsx(
        rootClassName,
        maxHeight && styles.truncated,
        folded && styles.folded,
      )}
      style={heightVariables}
      onTransitionEnd={(event) => {
        if (!folded && event.propertyName === "max-height") {
          setExpandedHeight(undefined);
        }
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
          contentRef.current = view.contentDOM;

          if (!truncateLines) {
            return;
          }

          const lineHeight = 20;
          const padding = 12;

          const visibleLines =
            typeof truncateLines === "number" ? truncateLines : 8;

          const totalLines = view.state.doc.lines;

          if (totalLines > visibleLines)
            setMaxHeight(lineHeight * visibleLines + padding);
        }}
        id={id}
      >
        {truncateLines && maxHeight && (
          <div className={clsx(styles.buttonContainer)}>
            <Button
              variant="plain"
              color="secondary"
              size="s"
              onPress={toggleFolded}
              aria-expanded={!folded}
              aria-controls={id}
            >
              {stringFormatter.format(folded ? "showMore" : "showLess")}
            </Button>
          </div>
        )}
      </CodeEditor>
    </div>
  );
};

export default CodeBlock;
