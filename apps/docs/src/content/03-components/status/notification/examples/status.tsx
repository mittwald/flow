import { Heading } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { Notification } from "@mittwald/flow-react-components";

<Row>
  <Notification status="info">
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
      Für <b>example.de</b> konnte kein SSL-Zertifikat
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
</Row>;
