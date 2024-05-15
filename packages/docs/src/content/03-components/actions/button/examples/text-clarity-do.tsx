import Button from "@mittwald/flow-react-components/Button";
import Section from "@mittwald/flow-react-components/Section";
import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import ButtonGroup from "@mittwald/flow-react-components/ButtonGroup";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";

<LayoutCard style={{ padding: "24px" }}>
  <Section>
    <Heading>
      Möchtest du die Bestellung wirklich verlassen?
    </Heading>
    <Text>
      Bist du sicher, dass du die Bestellung wirklich
      verlassen möchtest? Deine eingegebenen Daten werden
      nicht gespeichert.
    </Text>
    <ButtonGroup
      style={{
        backgroundColor: "#f8f8f8",
        marginInline: "-24px",
        marginBottom: "-24px",
        padding: "24px",
        borderTop: "1px solid #e6e6e6",
      }}
    >
      <Button color="secondary" variant="soft">
        Bestellung fortsetzen
      </Button>
      <Button color="danger">Bestellung verlassen</Button>
    </ButtonGroup>
  </Section>
</LayoutCard>;
