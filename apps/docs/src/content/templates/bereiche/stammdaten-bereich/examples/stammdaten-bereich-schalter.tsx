import {
  Header,
  Heading,
  Label,
  LayoutCard,
  ProgressBar,
  Section,
  Switch,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <LayoutCard>
    <Section>
      <Header>
        <Heading>Spamschutz</Heading>
        <Switch defaultSelected>
          <Label>Aktivieren</Label>
        </Switch>
      </Header>
      <Text>
        Ein Bereich, der genau eine Sache an- und
        ausschaltet, trägt den Schalter direkt in der
        Kopfzeile. Ein Overlay für eine einzige Umschaltung
        wäre ein Klick zu viel.
      </Text>
    </Section>

    <Section>
      <Header>
        <Heading>Speicherplatz</Heading>
      </Header>
      <Text>
        Wo eine Kennzahl den Zustand besser beschreibt als
        Wertepaare, tritt eine ProgressBar an ihre Stelle.
        Die Kopfzeile bleibt, wie sie ist.
      </Text>
      <ProgressBar
        formatOptions={{ style: "unit", unit: "gigabyte" }}
        size="l"
        showMaxValue
        maxValue={2}
        value={1.2}
        status="success"
      >
        <Label>Belegter Speicherplatz</Label>
      </ProgressBar>
    </Section>
  </LayoutCard>
);
