import Header from "@mittwald/flow-react-components/Header";
import Section from "@mittwald/flow-react-components/Section";
import StatusBadge from "@mittwald/flow-react-components/StatusBadge";
import Heading from "@mittwald/flow-react-components/Heading";
import Button from "@mittwald/flow-react-components/Button";
import Content from "@mittwald/flow-react-components/Content";
import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import Label from "@mittwald/flow-react-components/Label";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";

<Section>
  <Header>
    <Heading>
      Mein Projekt
      <StatusBadge status="danger">Deaktiviert</StatusBadge>
    </Heading>

    <Button variant="soft" color="secondary">
      Datenbank migrieren
    </Button>
    <Button color="accent">Aktivieren</Button>
  </Header>

  <Content>
    <ColumnLayout>
      <LabeledValue>
        <Label>Short-ID</Label>
        <Content>p-wut3uw</Content>
      </LabeledValue>
      <LabeledValue>
        <Label>Projektdomain</Label>
        <Content>p-lol3qe.project.space</Content>
      </LabeledValue>
      <LabeledValue>
        <Label>Erstellungsdatum</Label>
        <Content>06.12.2023 um 11:40 Uhr</Content>
      </LabeledValue>
    </ColumnLayout>
  </Content>
</Section>;
