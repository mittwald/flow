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
 * Flatten the patch fixes into a "version – **scope:** texts (#sha, …)" bullet
 * list, one bullet per scope, newest patch first (patchGroups are already
 * sorted newest-first).
 */
const fixesMarkdown = (release: Release): string =>
  release.patchGroups
    .flatMap((group) =>
      group.fixes.map((fix) => {
        const scope = fix.scope ? `**${fix.scope}:** ` : "";
        const commits = fix.commits
          .map((commit) => `[#${commit.sha}](${commit.url})`)
          .join(", ");
        return `- ${group.version} – ${scope}${fix.texts.join("; ")} (${commits})`;
      }),
    )
    .join("\n");

export const ReleaseEntry: FC<{ release: Release }> = ({ release }) => {
  const fixes = fixesMarkdown(release);

  return (
    <Section className={styles.entry}>
      <Heading
        level={2}
        id={releaseSlug(release.version)}
        className={styles.heading}
      >
        {release.version}{" "}
        <Badge color={release.kind === "major" ? "violet" : "blue"}>
          {release.kind === "major" ? "Major" : "Minor"}
        </Badge>
        {release.title && <> – {release.title}</>}
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
