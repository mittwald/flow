import {
  Alert,
  Content,
  Heading,
} from "@mittwald/flow-react-components";

<Row>
  <Alert status="info">
    <Heading>E-Mail-Adresse wurde archiviert</Heading>
    <Content>
      Da deine Domain gelöscht wurde, wurde diese
      E-Mail-Adresse archiviert. Um E-Mails empfangen und
      senden zu können musst du die Adresse wieder
      umbenennen.
    </Content>
  </Alert>

  <Alert status="warning">
    <Heading>Dein Speicher ist fast voll</Heading>
    <Content>
      Dein Speicher ist zu über 80% belegt. Wir empfehlen
      dir deinen Speicherplatz zu erweitern, um Problemen
      vorzubeugen.
    </Content>
  </Alert>

  <Alert status="danger">
    <Heading>
      Es konnte kein SSL-Zertifikat ausgestellt werden
    </Heading>
    <Content>
      Für diese Domain konnte kein SSL-Zertifikat
      ausgestellt werden, da die Domain per IP nicht auf
      deine Server-IP zeigt.
    </Content>
  </Alert>

  <Alert status="success">
    <Heading>Deine App wurde aktualisiert</Heading>
    <Content>
      Deine App wurde erfolgreich auf die neueste Version
      aktualisiert.
    </Content>
  </Alert>

  <Alert status="unavailable">
    <Heading>Inhalte nicht gefunden</Heading>
    <Content>
      Die gewünschten Inhalte sind leider nicht verfügbar.
      Entweder wurden sie inzwischen gelöscht oder dir
      fehlen die notwendigen Berechtigungen.
    </Content>
  </Alert>
</Row>;
