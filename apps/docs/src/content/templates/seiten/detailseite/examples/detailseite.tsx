import {
  ActionGroup,
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
  Switch,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <Flex direction="column" gap="m">
    <Flex direction="column">
      <Breadcrumb color="dark">
        <Link>Projekt</Link>
        <Link>E-Mail-Adressen</Link>
        <Link>max@mustermann.de</Link>
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
              <Text>Bearbeiten</Text>
            </MenuItem>
            <MenuItem>
              <IconPassword />
              <Text>Passwort ändern</Text>
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
      <Section>
        <Header>
          <Heading>E-Mail-Adresse</Heading>
          <ActionGroup>
            <ModalTrigger>
              <Button variant="soft" color="secondary">
                Passwort ändern
              </Button>
              <Modal offCanvas>
                <Heading>Passwort ändern</Heading>
                <Content>
                  <Text>…</Text>
                </Content>
              </Modal>
            </ModalTrigger>
            <ModalTrigger>
              <Button>Bearbeiten</Button>
              <Modal offCanvas>
                <Heading>E-Mail-Adresse bearbeiten</Heading>
                <Content>
                  <Text>…</Text>
                </Content>
              </Modal>
            </ModalTrigger>
          </ActionGroup>
        </Header>
        <ColumnLayout m={[1, 1]}>
          <LabeledValue>
            <Label>E-Mail-Adresse</Label>
            <Text>max@mustermann.de</Text>
          </LabeledValue>
          <LabeledValue>
            <Label>Angelegt am</Label>
            <Text>14. Februar 2026</Text>
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
            <Modal offCanvas>
              <Heading>Speicherplatz bearbeiten</Heading>
              <Content>
                <Text>…</Text>
              </Content>
            </Modal>
          </ModalTrigger>
        </Header>
        <Text>
          Die E-Mail-Adresse verfügt über einen
          Speicherplatz zum Empfangen und Speichern von
          E-Mails.
        </Text>
        <ProgressBar
          formatOptions={{
            style: "unit",
            unit: "gigabyte",
          }}
          size="l"
          showMaxValue
          maxValue={2}
          value={1.2}
          status="success"
        >
          <Label>Belegter Speicherplatz</Label>
        </ProgressBar>
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
          E-Mails. Wir empfehlen, ihn aktiviert zu lassen.
        </Text>
      </Section>
    </LayoutCard>
  </Flex>
);
