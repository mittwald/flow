import {
  Heading,
  Notification,
  Text,
  Flex,
} from "@mittwald/flow-react-components";

<Flex gap="m" wrap="wrap">
  <Notification>
    <Heading>E-Mail-Adresse archiviert</Heading>
    <Text>
      Die E-Mail-Adresse <b>example@mittwald.de</b> wurde
      archiviert.
    </Text>
  </Notification>

  <Notification status="warning">
    <Heading>Speicher fast voll</Heading>
    <Text>
      Der Speicherplatz im Projekt <b>My Project</b> ist zu
      80% voll.
    </Text>
  </Notification>

  <Notification status="danger">
    <Heading>Kein SSL-Zertifikat</Heading>
    <Text>
      Für <b>exmaple.de</b> konnte kein SSL-Zertifikat
      ausgestellt werden.
    </Text>
  </Notification>

  <Notification status="success">
    <Heading>App installiert</Heading>
    <Text>
      Deine App <b>My WordPress</b> wurde erfolgreich
      installiert.
    </Text>
  </Notification>

  <Notification status="unavailable">
    <Heading>Nicht gefunden</Heading>
    <Text>
      Die gewünschten Inhalte sind leider nicht verfügbar.
    </Text>
  </Notification>
</Flex>;
