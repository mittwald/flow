import Header from "@mittwald/flow-react-components/Header";
import { Text } from "@mittwald/flow-react-components/Text";
import Section from "@mittwald/flow-react-components/Section";
import AlertBadge from "@mittwald/flow-react-components/AlertBadge";
import Heading from "@mittwald/flow-react-components/Heading";
import Button from "@mittwald/flow-react-components/Button";
import Content from "@mittwald/flow-react-components/Content";
import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import Label from "@mittwald/flow-react-components/Label";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import { Link } from "@mittwald/flow-react-components/Link";
import { CopyButton } from "@mittwald/flow-react-components/CopyButton";
import {
  IconContextMenu,
  IconExternalLink,
} from "@mittwald/flow-react-components/Icons";

<Section>
  <Header>
    <Heading>
      Mein Projekt
      <AlertBadge status="danger">
        Fehlende Vertragspartnerdaten
      </AlertBadge>
    </Heading>
    <Button variant="soft" color="secondary">
      <IconContextMenu />
    </Button>
    <Button variant="soft" color="secondary">
      Datenbank migrieren
    </Button>
  </Header>

  <ColumnLayout>
    <LabeledValue>
      <Label>Projektname</Label>
      <Content>Dolce Vita</Content>
    </LabeledValue>
    <LabeledValue>
      <Label>Short-ID</Label>
      <Content>p-lol3qe</Content>
      <CopyButton text="p-lol3qe" />
    </LabeledValue>
    <LabeledValue>
      <Label>Projektdomain</Label>
      <Link>
        <Text>p-lol3qe.project.space</Text>
        <IconExternalLink />
      </Link>
      <CopyButton text="p-lol3qe.project.space" />
    </LabeledValue>
  </ColumnLayout>
</Section>;
