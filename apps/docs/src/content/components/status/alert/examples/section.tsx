import {
  Alert,
  Heading,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<LayoutCard>
  <Section>
    <Heading>E-Mail-Adresse</Heading>
    <Text>...</Text>
  </Section>
  <Section>
    <Heading>Speicherplatz</Heading>
    <Alert status="danger">
      <Heading>Speicherplatz ist voll</Heading>
      <Text>
        Der Speicherplatz deines Postfachs ist voll. Um
        wieder E-Mails erhalten zu können, kannst du der
        E-Mail-Adresse mehr Speicher zuweisen.
      </Text>
    </Alert>
    <Text>...</Text>
  </Section>
</LayoutCard>;
