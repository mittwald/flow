import type { Metadata } from "next";
import {
  Flex,
  Heading,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import AnchorNavigation from "@/app/_components/layout/AnchorNavigation";
import type { Anchor } from "@/lib/mdx/MdxFile";
import { getReleases } from "@/lib/releases/githubReleases";
import ReleaseEntry from "./_components/ReleaseEntry";
import { releaseSlug } from "./_lib/releaseSlug";
import { formatReleaseDate } from "./_lib/formatReleaseDate";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Überblick über die veröffentlichten Flow-Releases, ihre Highlights und die enthaltenen Fixes.",
};

export default async function ReleasesPage() {
  const releases = await getReleases();

  const anchors: Anchor[] = releases.map((r) => ({
    slug: releaseSlug(r.version),
    text: `${r.version} · ${formatReleaseDate(r.date)}`,
    level: 2,
  }));

  return (
    <Flex columnGap="m">
      <LayoutCard className={styles.timeline}>
        <Section>
          <Heading level={1}>Releases</Heading>
          <Text>
            Alle veröffentlichten Flow-Releases mit ihren Highlights,
            Migrationshinweisen und den enthaltenen Fixes.
          </Text>
        </Section>

        {releases.length === 0 ? (
          <Section>
            <Text>
              Sobald die ersten stabilen Releases veröffentlicht sind,
              erscheinen sie hier. Aktuell gibt es nur Vorab-Versionen.
            </Text>
          </Section>
        ) : (
          releases.map((release) => (
            <ReleaseEntry key={release.version} release={release} />
          ))
        )}
      </LayoutCard>
      <AnchorNavigation currentPath="/releases" anchors={anchors} />
    </Flex>
  );
}
