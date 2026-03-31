import {
  Action,
  ActionGroup,
  Alert,
  Button,
  CheckboxButton,
  ColumnLayout,
  Content,
  Heading,
  IconCheck,
  IconClose,
  Label,
  Link,
  Modal,
  ModalTrigger,
  Option,
  Section,
  Select,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Text,
} from "@mittwald/flow-react-components";

<ModalTrigger>
  <Button color="accent">Beispiel öffnen</Button>
  <Modal offCanvas>
    <Heading>Passwortschutz installieren</Heading>
    <Content>
      <Section>
        <Text>
          Wähle das Projekt aus, in das die Extension
          installiert werden soll. Die Extension wird dort
          integriert und bereitgestellt.
        </Text>
        <ColumnLayout m={[2, 1]}>
          <Select isRequired defaultSelectedKey="1">
            <Label>Organisation</Label>
            <Option value="1">Meine Organisation</Option>
            <Option value="2">
              Noch eine Organisation
            </Option>
          </Select>
        </ColumnLayout>
        <Alert status="warning">
          <Heading>Kein Vertragspartner hinterlegt</Heading>
          <Content>
            <Text>
              Die gewählte Organisation hat derzeit keinen
              Vertragspartner hinterlegt. Um mit der
              Installation fortzufahren, lege bitte einen
              Vertragspartner an.
            </Text>
            <Button color="accent">
              Vertragspartner anlegen
            </Button>
          </Content>
        </Alert>
        <Heading>Berechtigungen </Heading>
        <Text>
          Extensions brauchen Zugriffsberechtigungen, um
          bestimmte Bereiche im mStudio verwalten und/oder
          bearbeiten zu können. Bitte bestätige, dass diese
          Extension auf die folgenden Bereiche zugreifen
          darf:
        </Text>
        <Table>
          <TableHeader>
            <TableColumn>Bereich</TableColumn>
            <TableColumn>Lesen</TableColumn>
            <TableColumn>Schreiben</TableColumn>
            <TableColumn>Löschen</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Projekt</TableCell>
              <TableCell>
                <IconCheck status="success" />
              </TableCell>
              <TableCell>
                <IconClose status="danger" />
              </TableCell>
              <TableCell>
                <IconClose status="danger" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>App</TableCell>
              <TableCell>
                <IconCheck status="success" />
              </TableCell>
              <TableCell>
                <IconClose status="danger" />
              </TableCell>
              <TableCell>
                <IconClose status="danger" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>SSH-Benutzer</TableCell>
              <TableCell>
                <IconCheck status="success" />
              </TableCell>
              <TableCell>
                <IconCheck status="success" />
              </TableCell>
              <TableCell>
                <IconCheck status="success" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <CheckboxButton>
          <Text>
            Ich habe die{" "}
            <Link target="_blank">
              Vereinbarung zur Auftragsdatenverarbeitung
            </Link>{" "}
            gelesen und akzeptiere diese.
          </Text>
        </CheckboxButton>
      </Section>
    </Content>
    <ActionGroup>
      <Button isDisabled>Zur Bestellübersicht</Button>
      <Action closeModal>
        <Button color="secondary" variant="soft">
          Abbrechen
        </Button>
      </Action>
    </ActionGroup>
  </Modal>
</ModalTrigger>;
