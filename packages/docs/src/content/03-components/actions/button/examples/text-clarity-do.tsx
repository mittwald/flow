import Heading from "@mittwald/flow-react-components/Heading";
import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Button from "@mittwald/flow-react-components/Button";
import Text from "@mittwald/flow-react-components/Text";

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
      Bestellung fortsetzen
    </Button>
    <Button color="danger">Bestellung verlassen</Button>
  </ActionGroup>
</StaticModal>;
