import Header from "@mittwald/flow-react-components/Header";
import Section from "@mittwald/flow-react-components/Section";
import Heading from "@mittwald/flow-react-components/Heading";
import Button from "@mittwald/flow-react-components/Button";
import Content from "@mittwald/flow-react-components/Content";
import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import Label from "@mittwald/flow-react-components/Label";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import { IconContextMenu } from "@mittwald/flow-react-components/Icons";
import ContextMenu, {
  ContextMenuTrigger,
} from "@mittwald/flow-react-components/ContextMenu";
import MenuItem from "@mittwald/flow-react-components/MenuItem";

<Section>
  <Header>
    <Heading>Mein Projekt</Heading>

    <ContextMenuTrigger>
      <Button variant="soft" color="secondary">
        <IconContextMenu />
      </Button>
      <ContextMenu aria-label="Weitere Aktionen">
        <MenuItem>Datenbank migrieren</MenuItem>
        <MenuItem>Volume migrieren</MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>

    <Button color="danger">Deaktivieren</Button>
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
