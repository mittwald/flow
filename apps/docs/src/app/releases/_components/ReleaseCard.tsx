import type { FC } from "react";
import {
  Badge,
  Heading,
  LayoutCard,
  Link,
  Markdown,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import type { Release } from "@/lib/releases/types";
import { releaseSlug } from "../_lib/releaseSlug";

const formatDate = (iso: string): string =>
  iso
    ? new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(
        new Date(iso),
      )
    : "";

export const ReleaseCard: FC<{ release: Release }> = ({ release }) => {
  return (
    <LayoutCard>
      <Section>
        <Heading level={2} id={releaseSlug(release.version)}>
          {release.version}{" "}
          <Badge color={release.kind === "major" ? "violet" : "blue"}>
            {release.kind === "major" ? "Major" : "Minor"}
          </Badge>{" "}
          {release.isLatest && <Badge color="green">latest</Badge>}
        </Heading>
        <Text>{formatDate(release.date)}</Text>

        <Heading level={3}>{release.title}</Heading>

        {release.highlights.length > 0 && (
          <Markdown>
            {release.highlights.map((h) => `- ${h}`).join("\n")}
          </Markdown>
        )}

        {release.body && <Markdown headingOffset={2}>{release.body}</Markdown>}

        <Text>
          <Link href={release.npmUrl} target="_blank">
            npm
          </Link>{" "}
          ·{" "}
          <Link href={release.githubUrl} target="_blank">
            GitHub Release
          </Link>
        </Text>

        {release.patchGroups.length > 0 && (
          <>
            <Heading level={4}>Fixes</Heading>
            {release.patchGroups.map((group) => (
              <Section key={group.version}>
                <Heading level={5}>
                  {group.version} · {formatDate(group.date)}
                </Heading>
                <Markdown>
                  {group.fixes
                    .map(
                      (fix) =>
                        `- ${fix.text} ([#${fix.commitSha}](${fix.commitUrl}))`,
                    )
                    .join("\n")}
                </Markdown>
              </Section>
            ))}
          </>
        )}
      </Section>
    </LayoutCard>
  );
};

export default ReleaseCard;
