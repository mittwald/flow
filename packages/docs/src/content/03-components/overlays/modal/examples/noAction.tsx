import Content from "@mittwald/flow-react-components/Content";
import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Button from "@mittwald/flow-react-components/Button";
import Heading from "@mittwald/flow-react-components/Heading";
import Action from "@mittwald/flow-react-components/Action";
import Switch from "@mittwald/flow-react-components/Switch";
import Section from "@mittwald/flow-react-components/Section";

<StaticModal>
  <div className="flow--modal--content">
    <Heading>Einstellungen</Heading>
    <Content>
      <Section>
        <Switch defaultSelected>
          Container Frontend anzeigen
        </Switch>
        <Switch>Extensions anzeigen</Switch>
      </Section>
    </Content>
  </div>
  <ActionGroup className="flow--modal--action-group">
    <Action closeOverlay="Modal">
      <Button variant="soft" color="secondary">
        Schließen
      </Button>
    </Action>
  </ActionGroup>
</StaticModal>;
