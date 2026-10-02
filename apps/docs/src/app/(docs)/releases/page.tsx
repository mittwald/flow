import type { Metadata } from "next";
import {
  Flex,
  Heading,
  LayoutCard,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import AnchorNavigation from "@/app/_components/layout/AnchorNavigation";
import type { Anchor } from "@/lib/mdx/MdxFile";
import { topAnchorId } from "@/lib/mdx/MdxFile";
import { getReleases, releasesFeedUrl } from "@/lib/releases/githubReleases";
import ReleaseEntry from "./_components/ReleaseEntry";
import { releaseSlug } from "./_lib/releaseSlug";
import { formatReleaseDate } from "./_lib/formatReleaseDate";
import styles from "./page.module.scss";
import globalStyles from "@/app/layout.module.scss";

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Überblick über die veröffentlichten Flow-Releases, ihre Highlights und die enthaltenen Fixes.",
  alternates: {
    types: {
      "application/atom+xml": [
        {
          url: releasesFeedUrl,
          title: "Flow-Releases (inkl. Vorab-Versionen)",
        },
      ],
    },
  },
};

export default async function ReleasesPage() {
  const releases = await getReleases();

  // MDX pages get this entry from MdxFileFactory; this page builds its own.
  const anchors: Anchor[] = [
    { slug: topAnchorId, text: "Releases", level: 2 },
    ...releases.map((r) => ({
      slug: releaseSlug(r.version),
      text: `${r.version} – ${formatReleaseDate(r.date)}`,
      level: 2,
    })),
  ];

  return (
    <Flex columnGap="m">
      <LayoutCard className={styles.timeline}>
        <Section>
          <Heading
            level={1}
            id={topAnchorId}
            className={globalStyles.pageHeading}
          >
            Releases
          </Heading>
          <Text>
            Alle veröffentlichten Flow-Releases mit ihren Highlights,
            Migrationshinweisen und den enthaltenen Fixes. Wie du ein Update
            einspielst, beschreibt{" "}
            <Link inline href="/get-started/upgrades">
              Upgrades
            </Link>
            .
          </Text>
          <Text>
            Neue Releases kannst du über den{" "}
            <Link inline href={releasesFeedUrl} target="_blank">
              Atom-Feed von GitHub
            </Link>{" "}
            abonnieren. Anders als diese Seite enthält er auch Vorab-Versionen
            und nur die zehn neuesten Releases.
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
