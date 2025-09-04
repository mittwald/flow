import {
  Breadcrumb,
  Button,
  ColumnLayout,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  Flex,
  Header,
  Heading,
  IconChevronDown,
  IconDelete,
  IconEdit,
  IconPassword,
  Label,
  LabeledValue,
  LayoutCard,
  Link,
  MenuItem,
  Modal,
  ModalTrigger,
  ProgressBar,
  Section,
  Segment,
  SegmentedControl,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  TabTitle,
  Text,
  IconExternalLink,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const [connectionType, setConnectionType] =
    useState("IMAP");

  return (
    <Flex direction="column" gap="m">
      <Flex direction="column">
        <Breadcrumb color="light">
          <Link>Projekt</Link>
          <Link>E-Mails</Link>
          <Link>E-Mail-Details</Link>
        </Breadcrumb>
        <Flex justify="space-between">
          <Heading color="light" level={1}>
            max@mustermann.de
          </Heading>
          <ContextMenuTrigger>
            <Button variant="outline" color="light">
              <Text>Aktionen</Text>
              <IconChevronDown />
            </Button>
            <ContextMenu placement="bottom end">
              <MenuItem>
                <IconEdit />
                <Text>E-Mail-Adresse bearbeiten</Text>
              </MenuItem>
              <MenuItem>
                <IconPassword />
                <Text>Passwort ändern</Text>
              </MenuItem>
              <MenuItem>
                <IconExternalLink />
                <Text>mittwald Webmailer</Text>
              </MenuItem>
              <MenuItem>
                <IconDelete />
                <Text>Löschen</Text>
              </MenuItem>
            </ContextMenu>
          </ContextMenuTrigger>
        </Flex>
      </Flex>
      <LayoutCard>
        <Tabs>
          <Tab>
            <TabTitle>Allgemein</TabTitle>
            <Section>
              <Header>
                <Heading>E-Mail-Adresse</Heading>
                <ModalTrigger>
                  <Button variant="soft" color="secondary">
                    Passwort ändern
                  </Button>
                  <Modal>
                    <Heading>Passwort ändern</Heading>
                    <Content>
                      <Text>...</Text>
                    </Content>
                  </Modal>
                </ModalTrigger>
                <ModalTrigger>
                  <Button>E-Mail-Adresse bearbeiten</Button>
                  <Modal>
                    <Heading>
                      E-Mail-Adresse bearbeiten
                    </Heading>
                    <Content>
                      <Text>...</Text>
                    </Content>
                  </Modal>
                </ModalTrigger>
              </Header>
              <ColumnLayout>
                <LabeledValue>
                  <Label>E-Mail-Adresse</Label>
                  <Text>max@mustermann.de</Text>
                </LabeledValue>
                <LabeledValue>
                  <Label>Webmailer</Label>
                  <Link target="_blank">
                    mittwald Webmailer
                  </Link>
                </LabeledValue>
              </ColumnLayout>
            </Section>
            <Section>
              <Header>
                <Heading>Speicherplatz</Heading>
                <ModalTrigger>
                  <Button variant="soft" color="secondary">
                    Bearbeiten
                  </Button>
                  <Modal>
                    <Heading>
                      Speicherplatz bearbeiten
                    </Heading>
                    <Content>
                      <Text>...</Text>
                    </Content>
                  </Modal>
                </ModalTrigger>
              </Header>
              <Text>
                Die E-Mail-Adresse verfügt über einen
                Speicherplatz zum Empfangen und Speichern
                von E-Mails. Wir empfehlen dir, mindestens 2
                GB zu reservieren.
              </Text>
              <ProgressBar
                formatOptions={{
                  style: "unit",
                  unit: "gigabyte",
                }}
                size="l"
                showMaxValue
                maxValue={2}
                value={1}
                status="success"
              >
                <Label>Speicherplatz</Label>
              </ProgressBar>
            </Section>
            <Section>
              <Heading>Verbindungsinformationen</Heading>
              <SegmentedControl
                defaultValue={connectionType}
                onChange={setConnectionType}
                aria-label="Verbindungsart"
              >
                <Segment value="IMAP">IMAP</Segment>
                <Segment value="POP3">POP3</Segment>
                <Segment value="SMTP">SMTP</Segment>
              </SegmentedControl>
              <Table aria-label="Verbindungsinformationen">
                <TableHeader>
                  <TableColumn></TableColumn>
                  <TableColumn></TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell rowHeader>
                      Benutzername
                    </TableCell>
                    <TableCell>max@mustermann.de</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell rowHeader>
                      {connectionType} Port
                    </TableCell>
                    <TableCell>...</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell rowHeader>
                      {connectionType} Postausgang
                    </TableCell>
                    <TableCell>...</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Section>
            <Section>
              <Header>
                <Heading>Spamschutz</Heading>
                <Switch defaultSelected>Aktivieren</Switch>
              </Header>
              <Text>
                Der Spamfilter schützt dich vor ungewollten
                E-Mails. Niemand will Müll in seinem
                Postfach, daher empfehlen wir den Spamschutz
                immer aktiviert zu lassen.
              </Text>
            </Section>
          </Tab>
          <Tab>
            <TabTitle>Weiterleitungen</TabTitle>
            <Section>
              <Text>...</Text>
            </Section>
          </Tab>
          <Tab>
            <TabTitle>Autoresponder</TabTitle>
            <Section>
              <Text>...</Text>
            </Section>
          </Tab>
        </Tabs>
      </LayoutCard>
    </Flex>
  );
};
