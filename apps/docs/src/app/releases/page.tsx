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
import { getReleases } from "@/lib/releases/getReleases";
import ReleaseCard from "./_components/ReleaseCard";
import { releaseSlug } from "./_lib/releaseSlug";

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Überblick über die veröffentlichten Flow-Releases, ihre Highlights und die enthaltenen Fixes.",
};

export default async function ReleasesPage() {
  const releases = await getReleases();

  const anchors: Anchor[] = releases.map((r) => ({
    slug: releaseSlug(r.version),
    text: `${r.version} — ${r.title}`,
    level: 2,
  }));

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
            <ReleaseCard key={release.version} release={release} />
          ))
        )}
      </Flex>
      <AnchorNavigation currentPath="/releases" anchors={anchors} />
    </Flex>
  );
}
