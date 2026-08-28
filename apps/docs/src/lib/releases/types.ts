/** A single fix shipped in a patch release, linking its commit. */
export interface Fix {
  /** Fix description, e.g. "Combobox: fix focus loss on selection". */
  text: string;
  /** Short commit sha, e.g. "a1b2c3d". */
  commitSha: string;
  /** Absolute GitHub commit URL. */
  commitUrl: string;
}

/** All fixes shipped under one patch version of a minor line, e.g. 1.1.3. */
export interface PatchGroup {
  /** Full patch version, e.g. "1.1.3". */
  version: string;
  /** ISO date of the patch release. */
  date: string;
  fixes: Fix[];
}

/** A published Minor or Major release — rendered as one card. */
export interface Release {
  /** Full version, e.g. "1.1.0". */
  version: string;
  kind: "major" | "minor";
  /** ISO date of the minor/major release. */
  date: string;
  /** True for the newest release overall → shows the `latest` badge. */
  isLatest: boolean;
  /** Curated release title (English). */
  title: string;
  /** Highlights as a plain bullet list (no AccentBox). */
  highlights: string[];
  /** Curated body markdown incl. migration notes (English). */
  body: string;
  /** Npm version link. */
  npmUrl: string;
  /** GitHub Release html_url. */
  githubUrl: string;
  /** Fixes grouped by the patch versions of this minor line, newest first. */
  patchGroups: PatchGroup[];
}
