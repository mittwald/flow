import { ActionGroup } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Action } from "@mittwald/flow-react-components";
import { Switch } from "@mittwald/flow-react-components";
import { Section } from "@mittwald/flow-react-components";

<StaticModal>
  <header className="flow--modal--header">
    <Heading>Einstellungen</Heading>
  </header>
  <div className="flow--modal--content">
    <Section>
      <Switch defaultSelected>
        Container Frontend anzeigen
      </Switch>
      <Switch>Extensions anzeigen</Switch>
    </Section>
  </div>
  <ActionGroup className="flow--modal--action-group">
    <Action closeOverlay="Modal">
      <Button variant="soft" color="secondary">
        Schließen
      </Button>
    </Action>
  </ActionGroup>
</StaticModal>;
