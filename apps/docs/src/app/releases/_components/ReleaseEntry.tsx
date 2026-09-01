import type { FC } from "react";
import {
  Badge,
  Heading,
  Link,
  Markdown,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import type { Release } from "@/lib/releases/types";
import { releaseSlug } from "../_lib/releaseSlug";
import { formatReleaseDate } from "../_lib/formatReleaseDate";
import styles from "./ReleaseEntry.module.scss";

/**
 * Flatten every patch fix into a single "version – text (#sha)" bullet list,
 * newest patch first (patchGroups are already sorted newest-first).
 */
const fixesMarkdown = (release: Release): string =>
  release.patchGroups
    .flatMap((group) =>
      group.fixes.map(
        (fix) =>
          `- ${group.version} – ${fix.text} ([#${fix.commitSha}](${fix.commitUrl}))`,
      ),
    )
    .join("\n");

export const ReleaseEntry: FC<{ release: Release }> = ({ release }) => {
  const fixes = fixesMarkdown(release);

  return (
    <Section>
      <Heading
        level={2}
        id={releaseSlug(release.version)}
        className={styles.heading}
      >
        {release.version}{" "}
        <Badge color={release.kind === "major" ? "violet" : "blue"}>
          {release.kind === "major" ? "Major" : "Minor"}
        </Badge>{" "}
        – {release.title}
      </Heading>

      <Text elementType="p" className={styles.meta}>
        {formatReleaseDate(release.date)} -{" "}
        <Link size="s" href={release.npmUrl}>
          npm
        </Link>{" "}
        -{" "}
        <Link size="s" href={release.githubUrl}>
          GitHub Release
        </Link>
      </Text>

      {release.highlights.length > 0 && (
        <Markdown>
          {release.highlights.map((h) => `- ${h}`).join("\n")}
        </Markdown>
      )}

      {release.body && <Markdown headingOffset={1}>{release.body}</Markdown>}

      {fixes && (
        <>
          <Heading level={3}>Fixes</Heading>
          <Markdown>{fixes}</Markdown>
        </>
      )}
    </Section>
  );
};

export default ReleaseEntry;
