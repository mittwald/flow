import {
  ActionGroup,
  AlertIcon,
  Button,
  Heading,
  IllustratedMessage,
  Text,
} from "@mittwald/flow-react-components";

<div
  style={{
    background: "var(--overlay--background-color)",
    margin: "calc(var(--size-px--l) * -1)",
    padding: "var(--size-px--l)",
  }}
>
  <StaticModal>
    <div className="flow--modal--content">
      <IllustratedMessage color="danger">
        <AlertIcon status="danger" />
        <Heading>Fehler beim Laden </Heading>
        <Text>
          Dieser Bereich konnte nicht geladen werden. Wir
          arbeiten daran das Problem zu beheben.
        </Text>
      </IllustratedMessage>
    </div>
    <ActionGroup className="flow--modal--action-group">
      <Button color="secondary" variant="soft">
        Schließen
      </Button>
    </ActionGroup>
  </StaticModal>
</div>;
