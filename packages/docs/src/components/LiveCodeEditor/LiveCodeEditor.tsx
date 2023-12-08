"use client";
import React, {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  useRef,
  useState,
} from "react";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";
import { extractEditorScope } from "@/components/LiveCodeEditor/lib/extractEditorScope";
import { LiveCodeEditorProps } from "@/components/LiveCodeEditor/types";
import extractDefaultExport from "@/lib/extractDefaultExport";
import styles from "./LiveCodeEditor.module.css";
import { themes } from "prism-react-renderer";
import { PreviewWrapper } from "@/components/LiveCodeEditor/components/PreviewWrapper";

// Waiting for https://github.com/FormidableLabs/react-live/issues/339
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const LiveCodeEditor: FC<LiveCodeEditorProps> = (props) => {
  const { code } = props;

  if (typeof code !== "string") {
    throw new Error("Expected code prop to be of type 'string'.");
  }

  const [codeExpanded, setCodeExpanded] = useState(false);
  const checkboxRef = useRef<HTMLInputElement>(null);

  const scope = extractEditorScope(code);

  const transformRenderedCode = (code: string) => {
    if (!codeExpanded) {
      return `<>${code}</>`;
    }
    return `<>${transformCode(code)}</>`;
  };

  const transformCode = (code: string) => {
    try {
      return extractDefaultExport(code).trim();
    } catch (error) {
      return `<p><em>Example could not be parsed:</em> ${String(error)}</p>`;
    }
  };

  const handleCheckboxChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setCodeExpanded(event.currentTarget.checked);
  };

  const handleCheckboxWrapperClick: MouseEventHandler<HTMLDivElement> = () => {
    checkboxRef.current?.click();
  };

  return (
    <div className={styles.wrapper}>
      <LiveProvider
        code={codeExpanded ? code.trim() : transformCode(code)}
        scope={scope}
        transformCode={transformRenderedCode}
      >
        <LiveError className={styles.error} />
        <LivePreview Component={PreviewWrapper} />
        <div
          className={styles.expandCodeWrapper}
          onClick={handleCheckboxWrapperClick}
        >
          <input
            type="checkbox"
            onChange={handleCheckboxChange}
            className={styles.expandCodeCheckbox}
            ref={checkboxRef}
          />
          <span className={styles.expandCodeText}>
            {codeExpanded ? "Simplify Code" : "Expand Code"}
          </span>
        </div>
        <LiveEditor className={styles.editor} theme={themes.vsDark} />
      </LiveProvider>
    </div>
  );
};

export default LiveCodeEditor;
