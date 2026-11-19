import {
  AccentBox,
  Button,
  ColumnLayout,
  Heading,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<ColumnLayout>
  <AccentBox backgroundColor="blue">
    <Section>
      <Heading>Neu im mStudio</Heading>
      <Text>
        Alle Neuerungen der letzten Wochen auf einen Blick.
      </Text>
      <Link slot="action" href="#">
        Zu den Release Notes
      </Link>
    </Section>
  </AccentBox>
  <AccentBox backgroundColor="blue">
    <Section>
      <Heading>Deine Wunschdomain</Heading>
      <Text>
        Prüfe, ob deine Domain noch frei ist, und verbinde
        sie direkt mit deinem Projekt.
      </Text>
      <Button slot="action">Domain suchen</Button>
    </Section>
  </AccentBox>
</ColumnLayout>;
