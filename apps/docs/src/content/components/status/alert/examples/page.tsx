import {
  Alert,
  LayoutCard,
  Heading,
  Text,
  Section,
} from "@mittwald/flow-react-components";

<LayoutCard>
  <Alert status="danger">
    <Heading>E-Mail-Adresse wurde archiviert</Heading>
    <Text>
      Da deine Domain gelöscht wurde, wurde diese
      E-Mail-Adresse archiviert. Um E-Mails empfangen und
      senden zu können musst du die E-Mail-Adresse
      bearbeiten.
    </Text>
  </Alert>
  <Section>
    <Heading>E-Mail-Adresse</Heading>
    <Text>...</Text>
  </Section>
  <Section>
    <Heading>Speicherplatz</Heading>
    <Text>...</Text>
  </Section>
</LayoutCard>;
