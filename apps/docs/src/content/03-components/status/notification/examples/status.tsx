import {
  Heading,
  Notification,
  Text,
} from "@mittwald/flow-react-components";

<Row>
  <Notification status="info">
    <Heading>E-Mail-Adresse archiviert</Heading>
    <Text>
      Die E-Mail-Adresse{" "}
      <strong>example@mittwald.de</strong> wurde archiviert.
    </Text>
  </Notification>

  <Notification status="warning">
    <Heading>Speicher fast voll</Heading>
    <Text>
      Der Speicherplatz im Projekt{" "}
      <strong>My Project</strong> ist zu 80% voll.
    </Text>
  </Notification>

  <Notification status="danger">
    <Heading>Kein SSL-Zertifikat</Heading>
    <Text>
      Für <strong>example.de</strong> konnte kein
      SSL-Zertifikat ausgestellt werden.
    </Text>
  </Notification>

  <Notification status="success">
    <Heading>App installiert</Heading>
    <Text>
      Deine App <strong>My WordPress</strong> wurde
      erfolgreich installiert.
    </Text>
  </Notification>
</Row>;
