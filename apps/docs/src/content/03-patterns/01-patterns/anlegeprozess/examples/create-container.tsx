import {
  Action,
  ActionGroup,
  Align,
  Button,
  ColumnLayout,
  Content,
  CopyButton,
  Header,
  Heading,
  IconAI,
  IconClose,
  InlineCode,
  Label,
  LabeledValue,
  ListItemView,
  Modal,
  ModalTrigger,
  Section,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const VolumeList = typedList<{
    id: string;
    name: string;
    path: string;
    ai?: string;
  }>();

  return (
    <ModalTrigger>
      <Button color="accent">Beispiel öffnen</Button>
      <Modal offCanvas>
        <Heading>Container anlegen</Heading>
        <Content>
          <Section>
            <Header>
              <Heading>Entrypoint</Heading>
              <Button variant="soft" color="secondary">
                Bearbeiten
              </Button>
            </Header>
            <Text>
              Der Entrypoint definiert den primären Prozess,
              der in deinem Container gestartet werden soll.
              Der Command gibt an, mit welchen Parametern
              der Entrypoint gestartet wird.
            </Text>
            <ColumnLayout>
              <LabeledValue>
                <Label>Entrypoint</Label>
                <InlineCode>
                  docker-entrypoint.sh
                </InlineCode>
                <CopyButton value="docker-entrypoint.sh" />
              </LabeledValue>
              <LabeledValue>
                <Label>Command</Label>
                <InlineCode>mongod</InlineCode>
                <CopyButton value="mongod" />
              </LabeledValue>
            </ColumnLayout>

            <Header>
              <Heading>Volumes</Heading>
              <Button>Hinzufügen</Button>
            </Header>
            <Text>
              Volumes stellen Speicherplatz für deinem
              Container bereit. Alternativ kannst du einen
              Pfad innerhalb deines Projekts auswählen, um
              auf die Dateien zuzugreifen.
            </Text>
            <VolumeList.List
              hidePagination
              getItemId={(volume) => volume.id}
            >
              <VolumeList.StaticData
                data={[
                  {
                    id: "1",
                    name: "mongo-data-configdb-Rrku",
                    path: "/data/configdb",
                  },
                  {
                    id: "2",
                    name: "mongo-data-db-CnnD",
                    path: "/data/db",
                    ai: "Ein Verzeichnis für die Speicherung von MongoDB-Daten.",
                  },
                ]}
              />
              <VolumeList.Item>
                {(volume) => (
                  <ListItemView>
                    <Heading>{volume.name}</Heading>
                    <Text>{volume.path}</Text>
                    <Button
                      variant="plain"
                      color="secondary"
                    >
                      <IconClose />
                    </Button>
                    {volume.ai && (
                      <Content slot="bottom">
                        <Align>
                          <IconAI />
                          <Text>
                            <small>{volume.ai}</small>
                          </Text>
                        </Align>
                      </Content>
                    )}
                  </ListItemView>
                )}
              </VolumeList.Item>
            </VolumeList.List>

            <Header>
              <Heading>Umgebungsvariablen</Heading>
              <Button color="secondary" variant="soft">
                Bearbeiten
              </Button>
            </Header>
            <Table>
              <TableHeader>
                <TableColumn>Key</TableColumn>
                <TableColumn>Value</TableColumn>
                <TableColumn>KI-Unterstützung</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={3}
                    horizontalAlign="center"
                  >
                    Keine Variablen hinterlegt
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </Content>
        <ActionGroup>
          <Button color="accent">Anlegen</Button>
          <Button
            slot="secondary"
            color="secondary"
            variant="soft"
          >
            Zurück
          </Button>
          <Action closeModal>
            <Button color="secondary" variant="soft">
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </ModalTrigger>
  );
};
