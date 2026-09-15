import type { ComponentType } from "react";
import {
  Button,
  CodeBlock,
  LightBox,
  LightBoxTrigger,
} from "@mittwald/flow-react-components";
import styles from "./AppShellPreview.module.css";

export interface AppShellSourceFile {
  name: string;
  code: string;
  language: string;
}

export interface AppShellPreviewProps {
  /** The imported shell component, live-rendered in the preview frame. */
  component: ComponentType;
  /** The shell's source files, shown as copyable code blocks below the preview. */
  files: AppShellSourceFile[];
}

/**
 * The App Shell counterpart to `LiveCodeEditor`: it live-renders an imported
 * shell component (not react-live, so a co-located CSS module resolves) and
 * lists its real source files — `.tsx` plus `.module.css` — as separate
 * copyable blocks, teaching how to split a shell.
 *
 * The inline frame shows the shell zoomed out (16:9) so its whole layout reads
 * at a glance. Hovering dims it and reveals a centred "Vorschau" button; a
 * click anywhere on it opens the same live component near-fullscreen in a
 * LightBox.
 *
 * The full-cover trigger button is invisible and empty; the visible "Vorschau"
 * button is a decorative Flow Button that sits on top with pointer-events off,
 * so clicks fall through to the trigger. They cannot be one element: the
 * trigger spans the whole frame (a click on the dimmed backdrop must open too),
 * and a Flow Button cannot be nested inside another button.
 */
export const AppShellPreview = ({
  component: Component,
  files,
}: AppShellPreviewProps) => (
  <div className={styles.appShell}>
    <div className={styles.previewFrame}>
      <div className={styles.previewScaler} aria-hidden>
        <Component />
      </div>
      <LightBoxTrigger>
        <Button
          variant="plain"
          className={styles.previewButton}
          aria-label="Vorschau in Vollbild öffnen"
        />
        <LightBox>
          <div className={styles.stage}>
            <Component />
          </div>
        </LightBox>
      </LightBoxTrigger>
      <div className={styles.previewOverlay} aria-hidden>
        <Button color="light-static" variant="solid" excludeFromTabOrder>
          Vorschau
        </Button>
      </div>
    </div>
    {files.map((file) => (
      <div key={file.name} className={styles.file}>
        <span className={styles.fileName}>{file.name}</span>
        <CodeBlock
          copyable
          truncateLines={12}
          language={file.language}
          code={file.code}
        />
      </div>
    ))}
  </div>
);
