import type { Fix, FixGroup, PatchGroup, Release } from "./types";
import { themedFigures } from "./themedFigures";

interface GhRelease {
  tag_name: string;
  name: string | null;
  body: string | null;
  prerelease: boolean;
  published_at: string | null;
  html_url: string;
}

const REPO = "mittwald/flow";
const API = `https://api.github.com/repos/${REPO}/releases`;

/** GitHub's Atom feed: the 10 newest releases, prereleases included. */
export const releasesFeedUrl = `https://github.com/${REPO}/releases.atom`;

const isPrerelease = (r: GhRelease): boolean =>
  r.prerelease || /-(next|alpha|beta|rc)\./.test(r.tag_name);

/** Strip a leading "v" and return [major, minor, patch] or null. */
const parseSemver = (tag: string): [number, number, number] | null => {
  const m = tag.replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)$/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
};

const npmUrl = (version: string) =>
  `https://www.npmjs.com/package/@mittwald/flow-react-components/v/${version}`;

/** Changelog sections that reach consumers; tests, CI, docs and chores don't. */
const consumerSections = new Set([
  "Bug Fixes",
  "Features",
  "Performance Improvements",
  "Reverts",
]);

/** Scopes of repo tooling, which ship nothing to consumers in any section. */
const internalScopes = new Set([
  "agents",
  "ci",
  "commit-guard",
  "core",
  "dependabot",
  "deps",
  "deps-dev",
  "docs",
  "foundations",
  "release-figure",
  "releases",
  "remote-dom-demo",
  "repo",
  "sprach-guide",
]);

/**
 * Parse the consumer-relevant fix lines out of a (lerna-lite /
 * conventional-changelog) release body. The changelog appends up to two
 * markdown links per line — an issue/PR link and the commit link. We take the
 * sha from the trailing commit URL when present (else the last hex token on the
 * line) and strip all trailing link groups from the description. Lines with no
 * sha are skipped, and so are lines under a non-consumer section or with an
 * internal scope.
 */
export const parseFixes = (body: string | null): Fix[] => {
  if (!body) {
    return [];
  }
  const fixes: Fix[] = [];
  // A body without section headings keeps every line.
  let isConsumerSection = true;
  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();
    const section = line.match(/^#{2,}\s+(.*\S)\s*$/)?.[1];
    if (section !== undefined) {
      if (!/^\[?\d/.test(section)) {
        isConsumerSection = consumerSections.has(section);
      }
      continue;
    }
    if (
      !isConsumerSection ||
      (!line.startsWith("-") && !line.startsWith("*"))
    ) {
      continue;
    }

    const commitUrlMatch = line.match(/commit\/([0-9a-f]{7,40})/i);
    const hexTokens = line.match(/[0-9a-f]{7,40}/gi);
    const rawSha = commitUrlMatch?.[1] ?? hexTokens?.[hexTokens.length - 1];
    if (!rawSha) {
      continue;
    }
    const sha = rawSha.slice(0, 7);

    const text = line
      .replace(/^[-*]\s*/, "")
      .replace(/,?\s*closes\s+.*$/i, "")
      .replace(/(\s*\(\[[^\]]*\]\([^)]*\)\))+\s*\.?$/g, "")
      .replace(/\s*\([0-9a-f]{7,40}\)\s*\.?$/i, "")
      .trim();
    const scoped = text.match(/^\*\*([^*]+):\*\*\s*(.*)$/);
    const scope = scoped?.[1];
    if (scope !== undefined && internalScopes.has(scope)) {
      continue;
    }
    const description = scoped?.[2] ?? text;
    if (description) {
      fixes.push({
        scope,
        text: description,
        commitSha: sha,
        commitUrl: `https://github.com/${REPO}/commit/${sha}`,
      });
    }
  }
  return fixes;
};

/**
 * Merge a patch's fixes into one entry per scope, in order of first appearance,
 * so a version lists one line per affected area. Unscoped fixes share no topic
 * and stay one entry each.
 */
export const groupFixes = (fixes: Fix[]): FixGroup[] => {
  const groups: FixGroup[] = [];
  for (const fix of fixes) {
    const commit = { sha: fix.commitSha, url: fix.commitUrl };
    const group =
      fix.scope === undefined
        ? undefined
        : groups.find((g) => g.scope === fix.scope);
    if (group) {
      group.texts.push(fix.text);
      group.commits.push(commit);
    } else {
      groups.push({ scope: fix.scope, texts: [fix.text], commits: [commit] });
    }
  }
  return groups;
};

/**
 * Split the curated headline off a release body.
 *
 * The publish workflow titles every GitHub Release with the bare version (`gh
 * release create --title "${tag}"`), so a release's `name` is never the curated
 * headline — that lives as the body's leading H1. Taking `name` as the title
 * printed the version twice ("1.1.0 Minor – 1.1.0") and then repeated the real
 * headline as an h2 right below it.
 *
 * Only a _leading_ H1 counts as the headline; a `#` further down belongs to the
 * notes.
 */
export const splitHeadline = (
  body: string,
): { headline?: string; body: string } => {
  const lines = body.split("\n");
  const firstContent = lines.findIndex((line) => line.trim() !== "");
  const headline = lines[firstContent]?.match(/^#\s+(.*\S)\s*$/)?.[1];
  if (headline === undefined) {
    return { body };
  }
  return {
    headline,
    body: lines
      .slice(firstContent + 1)
      .join("\n")
      .replace(/^(?:[ \t]*\n)+/, ""),
  };
};

const fetchAll = async (): Promise<GhRelease[]> => {
  const all: GhRelease[] = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(`${API}?per_page=100&page=${page}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) {
      throw new Error(`GitHub API ${res.status}`);
    }
    const batch = (await res.json()) as GhRelease[];
    all.push(...batch);
    if (batch.length < 100) {
      break;
    }
  }
  return all;
};

/**
 * Single data entry point for the Releases page. Runs at build time (static
 * export) and returns the transformed live GitHub Releases. Never throws — a
 * failed fetch yields an empty list (empty-state placeholder).
 */
export const getReleases = async (): Promise<Release[]> => {
  let raw: GhRelease[];
  try {
    raw = await fetchAll();
  } catch (error) {
    console.warn(`[releases] live fetch failed, showing empty state: ${error}`);
    return [];
  }

  const stable = raw
    .filter((r) => !isPrerelease(r))
    .map((r) => ({ r, semver: parseSemver(r.tag_name) }))
    .filter(
      (x): x is { r: GhRelease; semver: [number, number, number] } =>
        x.semver !== null,
    );

  // Group everything by minor line "major.minor".
  const lines = new Map<
    string,
    { minorOrMajor?: GhRelease; kind: "major" | "minor"; patches: GhRelease[] }
  >();

  for (const { r, semver } of stable) {
    const [major, minor, patch] = semver;
    const key = `${major}.${minor}`;
    const entry = lines.get(key) ?? {
      kind: minor === 0 ? "major" : "minor",
      patches: [],
    };
    if (patch === 0) {
      entry.minorOrMajor = r;
    } else {
      entry.patches.push(r);
    }
    lines.set(key, entry);
  }

  const toDate = (r: GhRelease) => r.published_at ?? "";

  const releases: Release[] = [];
  for (const entry of lines.values()) {
    const head = entry.minorOrMajor;
    if (!head) {
      // A patch line with no committed x.y.0 head — skip (no card to attach to).
      continue;
    }
    const version = head.tag_name.replace(/^v/, "");
    const patchGroups: PatchGroup[] = entry.patches
      .map((p) => ({
        version: p.tag_name.replace(/^v/, ""),
        date: toDate(p),
        fixes: groupFixes(parseFixes(p.body)),
      }))
      .filter((group) => group.fixes.length > 0)
      .sort((a, b) =>
        b.version.localeCompare(a.version, undefined, { numeric: true }),
      );

    const { headline, body } = splitHeadline(
      themedFigures(head.body ?? "", (reason) =>
        console.warn(
          `[releases] ${version}: unreadable release figure, shown as code (${reason})`,
        ),
      ),
    );
    // A hand-titled Release is the only case where `name` carries a headline —
    // the publish workflow always sets it to the bare version.
    const name = head.name?.trim();
    const fallback =
      name && name.replace(/^v/, "") !== version ? name : undefined;

    releases.push({
      version,
      kind: entry.kind,
      date: toDate(head),
      isLatest: false,
      title: headline ?? fallback,
      highlights: [],
      body,
      npmUrl: npmUrl(version),
      githubUrl: head.html_url,
      patchGroups,
    });
  }

  releases.sort((a, b) =>
    b.version.localeCompare(a.version, undefined, { numeric: true }),
  );
  if (releases[0]) {
    releases[0].isLatest = true;
  }
  return releases;
};
