import Button from "@mittwald/flow-react-components/Button";
import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import ActionGroup from "@mittwald/flow-react-components/ActionGroup";

<StaticModal>
  <header className="flow--modal--header">
    <Heading>
      Möchtest du die Bestellung wirklich verlassen?
    </Heading>
  </header>
  <div className="flow--modal--content">
    <Text>
      Bist du sicher, dass du die Bestellung wirklich
      verlassen möchtest? Deine eingegebenen Daten werden
      nicht gespeichert.
    </Text>
  </div>
  <ActionGroup className="flow--modal--action-group">
    <Button color="secondary" variant="soft">
      Abbrechen
    </Button>
    <Button color="danger">Verlassen</Button>
  </ActionGroup>
</StaticModal>;
