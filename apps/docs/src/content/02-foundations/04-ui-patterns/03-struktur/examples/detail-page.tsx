import { Heading } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { Section } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { Header } from "@mittwald/flow-react-components";
import { ColumnLayout } from "@mittwald/flow-react-components";
import { LayoutCard } from "@mittwald/flow-react-components";
import {
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from "@mittwald/flow-react-components";
import { IconContextMenu } from "@mittwald/flow-react-components";
import { LabeledValue } from "@mittwald/flow-react-components";
import { Alert } from "@mittwald/flow-react-components";
import { Content } from "@mittwald/flow-react-components";
import { Action } from "@mittwald/flow-react-components";
import {
  Tab,
  Tabs,
  TabTitle,
} from "@mittwald/flow-react-components";

export default () => {
  const domain = {
    id: "4",
    hostname: "example.de",
    domain: "example.de",
    type: "Domain",
    ssl: undefined,
    owner: {
      firstName: "Franz",
      lastName: "Müller",
      street: "Jackenweg",
      houseNumber: "44a",
      zip: "12893",
      city: "Lanzhausen",
      email: "f.mueller@mittwald.de",
    },
  };

  const domainDetailsSection = (
    <Section>
      <Header>
        <Heading>Domain-Details</Heading>
        <ContextMenuTrigger>
          <Button color="secondary" variant="soft">
            <IconContextMenu />
          </Button>
          <ContextMenu>
            <MenuItem
              onAction={() => alert("not implemented")}
            >
              Domain umziehen
            </MenuItem>
            <MenuItem
              onAction={() => alert("not implemented")}
            >
              Domain entfernen
            </MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>

        <Button onPress={() => alert("not implemented")}>
          Domain-Ziel ändern
        </Button>
      </Header>
      <Alert status="danger">
        <Heading>
          Es konnte kein SSL-Zertifikat ausgestellt werden
        </Heading>
        <Content>
          <Text>
            Für diese Domain konnte kein SSL-Zertifikat
            ausgestellt werden, da {domain.hostname} nicht
            per DNS auf deine Server-IP zeigt. Ändere den
            A-Record oder CNAME auf die Server-IP zeigen. Es
            kann einige Minuten dauern, bis das Zertifikat
            bei korrekten Einstellungen ausgestellt ist.
          </Text>
          <Action showFeedback>
            <Button>SSL-Zertifikat ausstellen</Button>
          </Action>
        </Content>
      </Alert>
      <ColumnLayout s={[1, 1]}>
        <LabeledValue>
          <Label>Domain-Ziel</Label>
          <Text>{domain.hostname}</Text>
        </LabeledValue>
        <LabeledValue>
          <Label>Zertifikat</Label>
          <Text>{domain.ssl ? domain.ssl : "-"}</Text>
        </LabeledValue>
      </ColumnLayout>
    </Section>
  );

  const domainOwnerSection = (
    <Section>
      <Header>
        <Heading>Domain-Inhaber</Heading>
        <Button
          color="secondary"
          variant="soft"
          onPress={() => alert("not implemented")}
        >
          Bearbeiten
        </Button>
      </Header>
      <ColumnLayout>
        <LabeledValue>
          <Label>Inhaber</Label>
          <Text>
            {domain.owner.firstName} {domain.owner.lastName}
            <br />
            {domain.owner.street} {domain.owner.houseNumber}
            <br />
            {domain.owner.zip} {domain.owner.city}
          </Text>
        </LabeledValue>
        <LabeledValue>
          <Label>E-Mail-Adresse</Label>
          <Text>{domain.owner.email}</Text>
        </LabeledValue>
      </ColumnLayout>
    </Section>
  );

  return (
    <LayoutCard>
      <Tabs>
        <Tab>
          <TabTitle>Allgemein</TabTitle>
          {domainDetailsSection}
          {domainOwnerSection}
        </Tab>
        <Tab>
          <TabTitle>DNS</TabTitle>
          <Text>not implemented</Text>
        </Tab>
        <Tab>
          <TabTitle>Pfade</TabTitle>
          <Text>not implemented</Text>
        </Tab>
      </Tabs>
    </LayoutCard>
  );
};
