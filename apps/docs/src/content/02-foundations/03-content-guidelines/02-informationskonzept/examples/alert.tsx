import {
  Alert,
  Heading,
  Text,
  Content,
  Button,
  Link,
} from "@mittwald/flow-react-components";

<Column>
  <Alert>
    <Heading>E-Mail-Adresse wurde archiviert</Heading>
    <Content>
      <Text>
        Da deine Domain gelöscht wurde, wurde diese
        E-Mail-Adresse archiviert. Um E-Mails empfangen und
        senden zu können musst du die Adresse wieder
        umbenennen.
      </Text>
    </Content>
  </Alert>

  <Alert status="warning">
    <Heading>Dein Speicher ist fast voll</Heading>
    <Content>
      <Text>
        Dein Speicher ist zu über 80% belegt. Wir empfehlen
        dir deinen Speicherplatz zu erweitern, um Problemen
        vorzubeugen.
      </Text>
      <Button>Speicherplatz anpassen</Button>
    </Content>
  </Alert>

  <Alert status="danger">
    <Heading>
      Es konnte kein SSL-Zertifikat ausgestellt werden
    </Heading>
    <Content>
      <Text>
        Für diese Domain konnte kein SSL-Zertifikat
        ausgestellt werden, da die Domain per IP nicht auf
        deine Server-IP zeigt.
      </Text>
    </Content>
  </Alert>

  <Alert status="success">
    <Heading>E-Mail-Adresse wurde archiviert</Heading>
    <Content>
      <Text>
        Deine App wurde erfolgreich auf die neueste Version
        aktualisiert.
      </Text>
      <Link>Mehr Informationen zur aktuellen Version</Link>
    </Content>
  </Alert>
</Column>;
