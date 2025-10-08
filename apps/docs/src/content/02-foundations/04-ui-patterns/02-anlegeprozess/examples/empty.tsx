import {
  Action,
  ActionGroup,
  Align,
  Avatar,
  Button,
  CheckboxButton,
  ColumnLayout,
  Content,
  Header,
  Heading,
  IconDomain,
  IconPayment,
  IllustratedMessage,
  Initials,
  Label,
  LayoutCard,
  Link,
  Modal,
  ModalTrigger,
  Section,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableFooterRow,
  TableHeader,
  TableRow,
  Text,
  TextField,
} from "@mittwald/flow-react-components";

<LayoutCard>
  <IllustratedMessage>
    <IconDomain />
    <Heading>Erste Domain buchen</Heading>
    <Text>
      Du hast noch keine Domain bei uns gebucht. Buche jetzt
      für dein Projekt eine Domain.
    </Text>
    <ModalTrigger>
      <Button>Domain buchen</Button>
      <Modal offCanvas>
        <Heading>Domain buchen</Heading>
        <Content>
          <Section>
            <Heading>Wunsch-Domain</Heading>
            <Text>
              Eine Liste der Top-Level-Domains findest du
              auf unserer{" "}
              <Link
                target="_blank"
                href="https://www.mittwald.de/produkte/domains"
              >
                Domain-Seite
              </Link>
              .
            </Text>
            <TextField isRequired>
              <Label>Domain</Label>
            </TextField>

            <Header>
              <Heading>Domain-Inhaber</Heading>
              <Button
                color="accent"
                onPress={() => alert("not implemented")}
              >
                Hinzufügen
              </Button>
            </Header>
            <Text>
              Du hast noch keinen Domain-Inhaber angelegt.
            </Text>

            <Heading>Bestellübersicht</Heading>
            <ColumnLayout>
              <Align>
                <Avatar color="blue">
                  <Initials>Max Mustermann</Initials>
                </Avatar>
                <Text>
                  <b>Meine Organisation</b>
                  Franz Müller
                  <br />
                  Jackenweg 44a
                  <br />
                  12893 Lanzhausen
                </Text>
              </Align>
              <Align>
                <Avatar color="blue">
                  <IconPayment />
                </Avatar>
                <Text>
                  <b>Rechnung</b>
                  Franz Müller
                  <br />
                  Jackenweg 44a
                  <br />
                  12893 Lanzhausen
                </Text>
              </Align>
            </ColumnLayout>
            <Table>
              <TableHeader>
                <TableColumn>Artikel</TableColumn>
                <TableColumn>Preis</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Beispiel Domain</TableCell>
                  <TableCell>0,00 €</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Einrichtungsgebühr</TableCell>
                  <TableCell>0,00 €</TableCell>
                </TableRow>
                <TableFooterRow>
                  <TableCell>Gesamtpreis</TableCell>
                  <TableCell>0,00 €</TableCell>
                </TableFooterRow>
              </TableBody>
            </Table>
            <CheckboxButton isRequired>
              Ich verstehe, dass ein Klick auf
              „Kostenpflichtig buchen“ keinerlei
              Auswirkungen hat, da es sich um einen rein
              fiktiven Bestellprozess handelt. Es wird keine
              Bestellung ausgelöst und wir speichern keine
              Daten. Hier passiert nichts, daher sind AGBs
              und Datenschutz überflüssig.
            </CheckboxButton>
          </Section>
        </Content>
        <ActionGroup>
          <Action closeOverlay="Modal">
            <Button color="secondary" variant="soft">
              Abbrechen
            </Button>
            <Button color="accent">
              Kostenpflichtig bestellen
            </Button>
            ‚
          </Action>
        </ActionGroup>
      </Modal>
    </ModalTrigger>
  </IllustratedMessage>
</LayoutCard>;
