import {
  Action,
  ActionGroup,
  Button,
  Heading,
  Label,
  Section,
  Switch,
} from "@mittwald/flow-react-components";

<StaticModal>
  <header className="flow--modal--header">
    <Heading>Einstellungen</Heading>
  </header>
  <div className="flow--modal--content">
    <Section>
      <Switch defaultSelected>
        <Label>Container Frontend anzeigen</Label>
      </Switch>
      <Switch>
        <Label>Extensions anzeigen</Label>
      </Switch>
    </Section>
  </div>
  <ActionGroup className="flow--modal--action-group">
    <Action closeModal>
      <Button variant="soft" color="secondary">
        Schließen
      </Button>
    </Action>
  </ActionGroup>
</StaticModal>;
