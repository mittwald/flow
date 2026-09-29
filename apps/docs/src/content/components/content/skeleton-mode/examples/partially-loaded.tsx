import {
  Heading,
  Section,
  SkeletonMode,
  Text,
} from "@mittwald/flow-react-components";

<SkeletonMode>
  <Section>
    <SkeletonMode isEnabled={false}>
      <Heading>Speicherplatz</Heading>
    </SkeletonMode>
    <Text>Belegt sind 12,4 GB von 20 GB.</Text>
  </Section>
</SkeletonMode>;
