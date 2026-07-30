import type { Metadata } from "next";
import {
  Flex,
  Heading,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import { getReleases } from "@/lib/releases/getReleases";
import ReleaseCard from "./_components/ReleaseCard";

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Überblick über die veröffentlichten Flow-Releases, ihre Highlights und die enthaltenen Fixes.",
};

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
            <ReleaseCard key={release.version} release={release} />
          ))
        )}
      </Flex>
    </Flex>
  );
}
