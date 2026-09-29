import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

/* The first published version with SkeletonMode — 1.4.0-next.9 is out without
   it. Pin to the real release once it is published. */
const skeletonModeSince = "1.4.0-next.10";

test.skipIf(crossVersion({ below: skeletonModeSince })).each(testEnvironments)(
  "SkeletonMode text (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      SkeletonMode,
      Section,
      Heading,
      Text,
      Link,
      InlineCode,
      Label,
      LabeledValue,
      Content,
      BigNumber,
      AlertText,
      ColumnLayout,
    },
  }) => {
    await render(
      <SkeletonMode>
        <Section>
          <Heading>Projekt „Webshop Relaunch“</Heading>
          <Heading level={3} />
          <Text>
            Das Projekt liegt auf dem Server <InlineCode>p-4711</InlineCode> und
            ist unter <Link href="#">webshop.example-domain.de</Link>{" "}
            erreichbar. Die Daten werden jede Nacht gesichert und 30 Tage lang
            aufbewahrt.
          </Text>
          <Text />
          <ColumnLayout m={[1, 1, 1]}>
            <LabeledValue>
              <Label>Speicherplatz</Label>
              <Content>20 GB</Content>
            </LabeledValue>
            <LabeledValue>
              <Label />
              <Content>8.4</Content>
            </LabeledValue>
            <BigNumber>
              <Text>42</Text>
              <Text>Domains</Text>
            </BigNumber>
          </ColumnLayout>
          <AlertText status="warning">Das Zertifikat läuft bald ab.</AlertText>
          <SkeletonMode isEnabled={false}>
            <Text>Dieser Text ist bereits geladen.</Text>
          </SkeletonMode>
        </Section>
      </SkeletonMode>,
    );

    await testScreenshot("SkeletonMode text");
  },
);
