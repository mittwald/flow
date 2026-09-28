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
  IconExternalLink,
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
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TabNavigation,
  Tabs,
  TabTitle,
  Text,
} from "@mittwald/flow-react-components";

export default () => {
  return (
    <Flex direction="column" gap="m">
      <Flex direction="column">
        <Breadcrumb color="dark">
          <Link>Projekt</Link>
          <Link>E-Mails</Link>
          <Link>E-Mail-Details</Link>
        </Breadcrumb>
        <Flex justify="space-between" align="end">
          <Heading color="dark" level={1}>
            max@mustermann.de
          </Heading>
          <ContextMenuTrigger>
            <Button variant="outline" color="dark">
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
        <TabNavigation aria-label="E-Mail-Navigation">
          <Link href="#" aria-current="page">
            Allgemein
          </Link>
          <Link href="#">Weiterleitungen</Link>
          <Link href="#">Autoresponder</Link>
        </TabNavigation>
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
                <Heading>E-Mail-Adresse bearbeiten</Heading>
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
                <Heading>Speicherplatz bearbeiten</Heading>
                <Content>
                  <Text>...</Text>
                </Content>
              </Modal>
            </ModalTrigger>
          </Header>
          <Text>
            Die E-Mail-Adresse verfügt über einen
            Speicherplatz zum Empfangen und Speichern von
            E-Mails. Wir empfehlen dir, mindestens 2 GB zu
            reservieren.
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
          <Tabs>
            {["IMAP", "POP3", "SMTP"].map(
              (connectionType) => (
                <Tab
                  key={connectionType}
                  id={connectionType}
                >
                  <TabTitle>{connectionType}</TabTitle>
                  <Table
                    aria-label={`Verbindungsinformationen ${connectionType}`}
                  >
                    <TableHeader>
                      <TableColumn></TableColumn>
                      <TableColumn></TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell rowHeader>
                          Benutzername
                        </TableCell>
                        <TableCell>
                          max@mustermann.de
                        </TableCell>
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
                </Tab>
              ),
            )}
          </Tabs>
        </Section>
        <Section>
          <Header>
            <Heading>Spamschutz</Heading>
            <Switch defaultSelected>
              <Label>Aktivieren</Label>
            </Switch>
          </Header>
          <Text>
            Der Spamfilter schützt dich vor ungewollten
            E-Mails. Niemand will Müll in seinem Postfach,
            daher empfehlen wir den Spamschutz immer
            aktiviert zu lassen.
          </Text>
        </Section>
      </LayoutCard>
    </Flex>
  );
};
