import {
  ActionGroup,
  Avatar,
  Button,
  ColumnLayout,
  Content,
  CopyButton,
  Heading,
  IconEdit,
  Label,
  LabeledValue,
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
} from "@mittwald/flow-react-components";

export default () => {
  const changes = [
    { key: "TTL", value: "auto" },
    { key: "A-Records", value: "Durch mittwald verwaltet" },
  ];

  return (
    <ModalTrigger>
      <Button variant="soft" color="secondary">
        Details anzeigen
      </Button>
      <Modal>
        <Heading>
          Durch mittwald verwalteter A-Record gesetzt
        </Heading>
        <Content>
          <Section>
            <ColumnLayout m={[1, 1, 1]}>
              <LabeledValue>
                <Label>Ausgelöst von</Label>
                <Avatar color="blue">
                  <IconEdit />
                </Avatar>
                <Text>Automatisch</Text>
              </LabeledValue>
              <LabeledValue>
                <Label>Zeitpunkt</Label>
                <Text>10.08.2026 um 11:07 Uhr</Text>
              </LabeledValue>
              <LabeledValue>
                <Label>DNS-Zone</Label>
                <Text>test.iliketomoveit.de</Text>
              </LabeledValue>
            </ColumnLayout>

            <Table aria-label="Geänderte Werte">
              <TableHeader>
                <TableColumn>Typ</TableColumn>
                <TableColumn>Wert</TableColumn>
              </TableHeader>
              <TableBody>
                {changes.map((change) => (
                  <TableRow key={change.key}>
                    <TableCell rowHeader>
                      {change.key}
                    </TableCell>
                    <TableCell>
                      {change.value}
                      <CopyButton value={change.value} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>
        </Content>
        <ActionGroup>
          <Button variant="soft" color="secondary">
            Schließen
          </Button>
        </ActionGroup>
      </Modal>
    </ModalTrigger>
  );
};
