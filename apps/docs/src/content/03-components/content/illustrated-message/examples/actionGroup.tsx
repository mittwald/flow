import { Heading } from "@mittwald/flow-react-components";
import { IllustratedMessage } from "@mittwald/flow-react-components";
import { IconApp } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { ActionGroup } from "@mittwald/flow-react-components";

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
