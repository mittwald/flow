import {
  Button,
  Heading,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<>
  <LayoutCard data-flow-theme="light">
    <Section>
      <Heading>Light Bereich</Heading>
      <Text>
        Dieser Bereich verwendet explizit Light Theme
        Tokens.
      </Text>
      <Button>Aktion ausführen</Button>
    </Section>
  </LayoutCard>
  <LayoutCard data-flow-theme="dark">
    <Section>
      <Heading>Dark Bereich</Heading>
      <Text>
        Dieser Bereich verwendet explizit Dark Theme Tokens.
      </Text>
      <Button>Aktion ausführen</Button>
    </Section>
  </LayoutCard>
</>;
