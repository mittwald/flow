import Heading from "@mittwald/flow-react-components/Heading";
import IllustratedMessage from "@mittwald/flow-react-components/IllustratedMessage";
import { IconApp } from "@mittwald/flow-react-components/Icons";
import Text from "@mittwald/flow-react-components/Text";
import Button from "@mittwald/flow-react-components/Button";
import ActionGroup from "@mittwald/flow-react-components/ActionGroup";

<IllustratedMessage>
  <IconApp />
  <Heading>Keine Apps installiert</Heading>
  <Text>
    Lege deine erste App an, um mit der Arbeit an deiner
    Webseite loszulegen.
  </Text>
  <ActionGroup>
    <Button variant="soft" color="secondary">
      Zurück
    </Button>
    <Button>App anlegen</Button>
  </ActionGroup>
</IllustratedMessage>;
