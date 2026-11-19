import {
  Alert,
  Heading,
  Text,
  Button,
  Link,
} from "@mittwald/flow-react-components";

<>
  <Alert>
    <Heading>E-Mail-Adresse wurde archiviert</Heading>
    <Text>
      Da deine Domain gelöscht wurde, wurde diese
      E-Mail-Adresse archiviert. Um E-Mails empfangen und
      senden zu können musst du die Adresse wieder
      umbenennen.
    </Text>
  </Alert>

  <Alert status="warning">
    <Heading>Dein Speicher ist fast voll</Heading>
    <Text>
      Dein Speicher ist zu über 80% belegt. Wir empfehlen
      dir deinen Speicherplatz zu erweitern, um Problemen
      vorzubeugen.
    </Text>
    <Button>Speicherplatz anpassen</Button>
  </Alert>

  <Alert status="danger">
    <Heading>
      Es konnte kein SSL-Zertifikat ausgestellt werden
    </Heading>
    <Text>
      Für diese Domain konnte kein SSL-Zertifikat
      ausgestellt werden, da die Domain per IP nicht auf
      deine Server-IP zeigt.
    </Text>
  </Alert>

  <Alert status="success">
    <Heading>App aktualisiert</Heading>
    <Text>
      Deine App wurde erfolgreich auf die neueste Version
      aktualisiert.
    </Text>
    <Link>Mehr Informationen zur aktuellen Version</Link>
  </Alert>

  <Alert status="unavailable">
    <Heading>Inhalte nicht gefunden</Heading>
    <Text>
      Die gewünschten Inhalte sind leider nicht verfügbar.
      Entweder wurden sie inzwischen gelöscht oder dir
      fehlen die notwendigen Berechtigungen.
    </Text>
  </Alert>
</>;
