import InlineAlert from "@mittwald/flow-react-components/InlineAlert";
import Heading from "@mittwald/flow-react-components/Heading";
import Content from "@mittwald/flow-react-components/Content";

<Row>
  <InlineAlert status="info">
    <Heading>E-Mail-Adresse wurde archiviert</Heading>
    <Content>
      Da deine Domain gelöscht wurde, wurde diese
      E-Mail-Adresse archiviert. Um E-Mails empfangen und
      senden zu können musst du die Adresse wieder
      umbenennen.
    </Content>
  </InlineAlert>

  <InlineAlert status="warning">
    <Heading>Dein Speicher ist fast voll</Heading>
    <Content>
      Dein Speicher ist zu über 80% belegt. Wir empfehlen
      dir deinen Speicherplatz zu erweitern, um Problemen
      vorzubeugen.
    </Content>
  </InlineAlert>

  <InlineAlert status="danger">
    <Heading>
      Es konnte kein SSL-Zertifikat ausgestellt werden
    </Heading>
    <Content>
      Für diese Domain konnte kein SSL-Zertifikat
      ausgestellt werden, da die Domain per IP nicht auf
      deine Server-IP zeigt.
    </Content>
  </InlineAlert>

  <InlineAlert status="success">
    <Heading>Deine App wurde aktualisiert</Heading>
    <Content>
      Deine App wurde erfolgreich auf die neueste Version
      aktualisiert.
    </Content>
  </InlineAlert>
</Row>;
