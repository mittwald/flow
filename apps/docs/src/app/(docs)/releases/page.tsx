import type { Metadata } from "next";
import {
  Flex,
  LayoutCard,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import AnchorNavigation from "@/app/_components/layout/AnchorNavigation";
import type { Anchor } from "@/lib/mdx/MdxFile";
import { topAnchorId } from "@/lib/mdx/MdxFile";
import { getReleases } from "@/lib/releases/githubReleases";
import ReleaseEntry from "./_components/ReleaseEntry";
import { releaseSlug } from "./_lib/releaseSlug";
import { formatReleaseDate } from "./_lib/formatReleaseDate";
import PageStage from "@/app/_components/layout/PageStage";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Überblick über die veröffentlichten Flow-Releases, ihre Highlights und die enthaltenen Fixes.",
};

export default async function ReleasesPage() {
  const releases = await getReleases();

  // MDX pages get this entry from MdxFileFactory; this page builds its own.
  const anchors: Anchor[] = [
    { slug: topAnchorId, text: "Releases", level: 2 },
    ...releases.map((r) => ({
      slug: releaseSlug(r.version),
      text: `${r.version} · ${formatReleaseDate(r.date)}`,
      level: 2,
    })),
  ];

  return (
    <Flex columnGap="m">
      <div className={styles.timeline}>
        <PageStage
          eyebrow="Flow"
          title="Releases"
          section="releases"
          description={
            <>
              Alle veröffentlichten Flow-Releases mit ihren Highlights,
              Migrationshinweisen und den enthaltenen Fixes. Wie du ein Update
              einspielst, beschreibt{" "}
              <Link inline href="/get-started/upgrades" color="light-static">
                Upgrades
              </Link>
              .
            </>
          }
        />
        <LayoutCard className={styles.timelineCard}>
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
      </div>
      <AnchorNavigation currentPath="/releases" anchors={anchors} />
    </Flex>
  );
}
