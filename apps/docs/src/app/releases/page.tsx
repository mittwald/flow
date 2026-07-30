import type { Metadata } from "next";
import {
  Flex,
  Heading,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import { getReleases } from "@/lib/releases/getReleases";

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Überblick über die veröffentlichten Flow-Releases, ihre Highlights und die enthaltenen Fixes.",
};

/** Deterministic anchor/id slug for a release, e.g. "1.1.0" -> "release-1-1-0". */
export const releaseSlug = (version: string): string =>
  `release-${version.replace(/\./g, "-")}`;

export default async function ReleasesPage() {
  const releases = await getReleases();

  return (
    <Flex columnGap="m">
      <Flex direction="column" gap="m">
        {releases.length === 0 ? (
          <LayoutCard>
            <Section>
              <Heading level={1}>Releases</Heading>
              <Text>
                Sobald die ersten stabilen Releases veröffentlicht sind,
                erscheinen sie hier. Aktuell gibt es nur Vorab-Versionen.
              </Text>
            </Section>
          </LayoutCard>
        ) : (
          releases.map((release) => (
            <LayoutCard key={release.version}>
              <Section>
                <Heading level={2} id={releaseSlug(release.version)}>
                  {release.version} — {release.title}
                </Heading>
                <Text>{release.date}</Text>
              </Section>
            </LayoutCard>
          ))
        )}
      </Flex>
    </Flex>
  );
}
