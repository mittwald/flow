import {
  Alert,
  Button,
  Heading,
  Text,
} from "@mittwald/flow-react-components";

<Alert>
  <Heading>E-Mail-Empfang wurde deaktiviert</Heading>
  <Text>
    Der Empfang der E-Mails für dieses Postfach ist aufgrund
    fehlerhafter MX-Records deaktiviert. Bitte setze die
    richtigen Mailserver. Bei einer Neuregistrierung einer
    Domain kann es einige Minuten dauern, bis die MX-Records
    global im DNS verfügbar sind. Die E-Mail-Adresse wird in
    diesem Fall automatisch aktiviert.
  </Text>
  <Button>MX-Records anpassen</Button>
</Alert>;
