import type { FC, JSX } from "react";
import React, { useState } from "react";
import {
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
} from "@mfalkenberg/react-live-ssr";
import { extractEditorScope } from "@/lib/liveCode/components/LiveCodeEditor/lib/extractEditorScope";
import extractDefaultExport from "@/lib/liveCode/components/LiveCodeEditor/lib/extractDefaultExport";
import styles from "./LiveCodeEditor.module.css";
import * as EditorComponents from "./components";
import clsx from "clsx";
import { Button } from "@mittwald/flow-react-components";
import { themes } from "prism-react-renderer";

export interface LiveCodeEditorProps {
  code: string | JSX.Element;
  className?: string;
  editorCollapsed?: boolean;
  editorDisabled?: boolean;
  zoom?: number;
  bgColor?: "mstudio" | "dark" | "light";
  mobile?: boolean;
}

// Waiting for https://github.com/FormidableLabs/react-live/issues/339
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const LiveCodeEditor: FC<LiveCodeEditorProps> = (props) => {
  const {
    code,
    className,
    editorCollapsed: editorInitiallyCollapsed,
    editorDisabled,
    zoom = 1,
    bgColor,
    mobile,
  } = props;

  const [editorCollapsed, setEditorCollapsed] = useState(
    editorInitiallyCollapsed,
  );

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

  const codeToDisplay = code.replace(/;\r?\n$/, "");

  return (
    <LiveProvider
      code={codeToDisplay}
      scope={{
        ...scope,
        ...EditorComponents,
      }}
      transformCode={transformCode}
    >
      <div
        className={clsx(
          styles.liveCodeEditor,
          bgColor === "dark" && styles.darkBackground,
          bgColor === "light" && styles.lightBackground,
          bgColor === "mstudio" && styles.mstudioBackground,
          mobile && styles.mobile,
          className,
        )}
      >
        <LivePreview className={clsx(styles.preview)} style={{ zoom }} />

        {!editorDisabled && (
          <div className={styles.editorContainer}>
            {!editorCollapsed && (
              <LiveEditor
                tabMode="focus"
                theme={themes.vsLight}
                className={styles.editor}
              />
            )}
          </div>
        )}

        {!editorDisabled && (
          <div className={styles.actions}>
            <Button
              className={styles.toggleCode}
              size="s"
              variant="plain"
              color="secondary"
              onPress={() => setEditorCollapsed(!editorCollapsed)}
            >
              {editorCollapsed ? <>Code anzeigen</> : <>Code ausblenden</>}
            </Button>
          </div>
        )}

        <LiveError className={styles.error} />
      </div>
    </LiveProvider>
  );
};

export default LiveCodeEditor;
