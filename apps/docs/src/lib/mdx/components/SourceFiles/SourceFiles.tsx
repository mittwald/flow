import { CodeBlock } from "@mittwald/flow-react-components";
import styles from "./SourceFiles.module.css";

export interface SourceFile {
  name: string;
  code: string;
  language: string;
}

export interface SourceFilesProps {
  files: SourceFile[];
}

/**
 * The source files of a multi-file example, each as a separate copyable block
 * under its file name – shared by `AppShellPreview` and `FileExample`.
 */
export const SourceFiles = ({ files }: SourceFilesProps) =>
  files.map((file) => (
    <div key={file.name} className={styles.file}>
      <span className={styles.fileName}>{file.name}</span>
      <CodeBlock
        copyable
        truncateLines={12}
        language={file.language}
        code={file.code}
      />
    </div>
  ));
