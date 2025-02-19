import { Header } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { Section } from "@mittwald/flow-react-components";
import { AlertBadge } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { Content } from "@mittwald/flow-react-components";
import { LabeledValue } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { ColumnLayout } from "@mittwald/flow-react-components";
import { Link } from "@mittwald/flow-react-components";
import { CopyButton } from "@mittwald/flow-react-components";
import {
  IconContextMenu,
  IconExternalLink,
} from "@mittwald/flow-react-components";

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
