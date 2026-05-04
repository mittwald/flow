import {
  Alert,
  Button,
  Content,
  Heading,
} from "@mittwald/flow-react-components";

<Alert>
  <Heading>E-Mail-Empfang wurde deaktiviert</Heading>
  <Content>
    Der Empfang der E-Mails für dieses Postfach ist aufgrund fehlerhafter MX-Records deaktiviert. Bitte setze die richtigen Mailserver.
    Bei einer Neuregistrierung einer Domain kann es einige Minuten dauern, bis die MX-Records global im DNS verfügbar sind. 
    Die E-Mail-Adresse wird in diesem Fall automatisch aktiviert.
    <Button>MX-Records anpassen</Button>
  </Content>
</Alert>;
