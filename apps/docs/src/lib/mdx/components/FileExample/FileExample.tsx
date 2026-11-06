import type { ComponentType } from "react";
import { type SourceFile, SourceFiles } from "@/lib/mdx/components/SourceFiles";
import styles from "./FileExample.module.css";

export interface FileExampleProps {
  /** The imported example component, live-rendered in the preview. */
  component: ComponentType;
  /** The example's source files, shown as copyable code blocks below it. */
  files: SourceFile[];
}

/**
 * The multi-file counterpart to `LiveCodeEditor` for examples that bring their
 * own CSS module. It renders an imported component (not react-live, so the
 * co-located CSS module resolves) at full size and fully interactive, and lists
 * the `.tsx` and `.module.css` below it. Unlike `AppShellPreview` there is no
 * zoomed-out frame and no full-screen page: a Baustein is tried out in place.
 */
export const FileExample = ({
  component: Component,
  files,
}: FileExampleProps) => (
  <div className={styles.fileExample}>
    <div className={styles.preview}>
      <Component />
    </div>
    <SourceFiles files={files} />
  </div>
);
