import {
  AccentBox,
  BigNumber,
  ColumnLayout,
  Flex,
  Heading,
  Icon,
  Link,
  Section,
  Rating,
  Text,
} from "@mittwald/flow-react-components";
import {
  IconLeaf,
  IconMoodSmileBeam,
} from "@tabler/icons-react";

<Section>
  <AccentBox color="blue">
    <Icon>
      <IconMoodSmileBeam />
    </Icon>
    <Section>
      <Heading>
        Hilf uns, Flow noch besser zu machen!
      </Heading>
      <Text>
        Fehlt dir eine bestimmte Component oder etwas anderes? Hast du Feedback? Dann teile es uns gerne auf GitHub mit.
      </Text>
      <Link href="#" target="_blank">
        Feedback zu Flow geben
      </Link>
    </Section>
  </AccentBox>
  <AccentBox color="green">
    <Icon>
      <IconLeaf />
    </Icon>
    <Section>
      <Heading>Tipps & Tricks für mehr Klimaschutz</Heading>
      <Text>
        Dein Cronjob läuft in weniger als
        5-Minuten-Intervallen. Das verbraucht mehr Ressourcen.
        Falls das nicht unbedingt nötig ist, kannst du ein
        längeres Intervall wählen - das spart Energie und
        schützt das Klima
      </Text>
      <Link href="#" target="_blank">
        Blogartikel zu mehr Nachhaltigkeit
      </Link>
    </Section>
  </AccentBox>

  <ColumnLayout>
  <AccentBox color="neutral">
    <Flex direction="column" gap="s" align="center">
      <BigNumber>
        <Text>250 ms</Text>
        <Text>Dateioperationen</Text>
      </BigNumber>
      <Rating value={4} />
      <Text>
        <small>Geringer Optimierungsbedarf</small>
      </Text>
    </Flex>
  </AccentBox>
  <AccentBox color="neutral">
    <Flex direction="column" gap="xs" align="center">
      <BigNumber>
        <Text>100 ms</Text>
        <Text>Serveroperationen</Text>
      </BigNumber>
      <Rating value={2} />
      <Text>
        <small>Optimierungsbedarf</small>
      </Text>
    </Flex>
  </AccentBox>
</ColumnLayout>
  
</Section>;
