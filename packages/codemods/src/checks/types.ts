/** Where a check found something, so the reader can go look. */
export interface Finding {
  file: string;
  line: number;
  text: string;
}

/**
 * What a check gets. Pure Node — no subprocess, so this works on Windows, in a
 * minimal container, and without ripgrep installed.
 */
export interface CheckContext {
  /** Absolute path to the consumer's sources. */
  path: string;
  /** Files under `path`, with node_modules / dist / .git excluded. */
  files(extensions?: string[]): Promise<string[]>;
  read(file: string): Promise<string>;
  /** Every match across those files. Most checks need only this. */
  search(pattern: RegExp, extensions?: string[]): Promise<Finding[]>;
}

export interface Detector {
  detect(context: CheckContext): Promise<Finding[]>;
}

export interface VerifyResult {
  /** False when something the check _can_ decide is still wrong. */
  ok: boolean;
  findings: Finding[];
  /**
   * What a person must still do or judge. Printed under the migration's name.
   * This is where the `tsc --noEmit` reminder lives: running it is a global
   * check, and this CLI wraps no commands.
   */
  hints: string[];
}

export interface Verifier {
  verify(context: CheckContext): Promise<VerifyResult>;
}
