import React, { FC } from "react";
import {
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
} from "@mfalkenberg/react-live-ssr";
import { extractEditorScope } from "@/lib/LiveCodeEditor/component/lib/extractEditorScope";
import { LiveCodeEditorProps } from "@/lib/LiveCodeEditor/component/types";
import extractDefaultExport from "@/lib/LiveCodeEditor/component/lib/extractDefaultExport";
import styles from "./LiveCodeEditor.module.css";

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

  const scope = extractEditorScope(code);

  const transformCode = (code: string) => {
    try {
      return extractDefaultExport(code);
    } catch (error) {
      return `<p><em>Example could not be parsed:</em> ${String(error)}</p>`;
    }
  };

  return (
    <LiveProvider code={code} scope={scope} transformCode={transformCode}>
      <div className={styles.root}>
        <LivePreview className={styles.preview} />
        <div className={styles.editorContainer}>
          <LiveEditor className={styles.editor} />
        </div>
        <LiveError className={styles.error} />
      </div>
    </LiveProvider>
  );
};

export default LiveCodeEditor;
