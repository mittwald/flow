import type { Fix, PatchGroup, Release } from "./types";

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

const isPrerelease = (r: GhRelease): boolean =>
  r.prerelease || /-(next|alpha|beta|rc)\./.test(r.tag_name);

/** Strip a leading "v" and return [major, minor, patch] or null. */
const parseSemver = (tag: string): [number, number, number] | null => {
  const m = tag.replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)$/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
};

const npmUrl = (version: string) =>
  `https://www.npmjs.com/package/@mittwald/flow-react-components/v/${version}`;

/**
 * Parse fix lines out of a (lerna-lite / conventional-changelog) release body.
 * The changelog appends up to two markdown links per line — an issue/PR link
 * and the commit link. We take the sha from the trailing commit URL when
 * present (else the last hex token on the line) and strip all trailing link
 * groups from the description. Lines with no sha are skipped.
 */
const parseFixes = (body: string | null): Fix[] => {
  if (!body) {
    return [];
  }
  const fixes: Fix[] = [];
  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();
    if (!line.startsWith("-") && !line.startsWith("*")) {
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
    if (text) {
      fixes.push({
        text,
        commitSha: sha,
        commitUrl: `https://github.com/${REPO}/commit/${sha}`,
      });
    }
  }
  return fixes;
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
        fixes: parseFixes(p.body),
      }))
      .sort((a, b) =>
        b.version.localeCompare(a.version, undefined, { numeric: true }),
      );

    releases.push({
      version,
      kind: entry.kind,
      date: toDate(head),
      isLatest: false,
      title: head.name?.trim() || version,
      highlights: [],
      body: head.body ?? "",
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
