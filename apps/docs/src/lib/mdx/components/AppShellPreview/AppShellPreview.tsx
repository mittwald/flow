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
 * at a glance. It is only a scaled-down picture, so it is `inert`: its controls
 * stay out of the tab order and swallow no clicks, which keeps keyboard users
 * from getting trapped in a preview they cannot really operate.
 *
 * The one real control is the centred "Vorschau" button, which is the LightBox
 * trigger itself — so it takes keyboard focus and shows its own focus ring.
 * Hover or focus dims the frame and reveals it; activating it opens the same
 * live component near-fullscreen in a LightBox, where it is fully interactive.
 */
export const AppShellPreview = ({
  component: Component,
  files,
}: AppShellPreviewProps) => (
  <div className={styles.appShell}>
    <div className={styles.previewFrame}>
      <div className={styles.previewScaler} aria-hidden inert>
        <Component />
      </div>
      <LightBoxTrigger>
        <Button
          color="light-static"
          variant="solid"
          className={styles.previewButton}
          aria-label="Vorschau in Vollbild öffnen"
        >
          Vorschau
        </Button>
        <LightBox>
          <div className={styles.stage}>
            <Component />
          </div>
        </LightBox>
      </LightBoxTrigger>
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
