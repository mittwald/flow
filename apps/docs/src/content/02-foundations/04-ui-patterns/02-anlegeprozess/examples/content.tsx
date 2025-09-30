import {
  Action,
  ActionGroup,
  AlertBadge,
  Align,
  Avatar,
  Button,
  CheckboxButton,
  ColumnLayout,
  Content,
  Header,
  Heading,
  IconDomain,
  IconHome,
  IconPayment,
  IconSubdomain,
  Initials,
  Label,
  LayoutCard,
  Link,
  ListItemView,
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
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  interface Domain {
    hostname: string;
    type: "Domain" | "Subdomain" | "Default-Domain";
    ssl?: string;
  }

  const domains: Domain[] = [
    {
      hostname: "toujours.de",
      type: "Domain",
    },
    {
      hostname: "www.toujours.de",
      type: "Subdomain",
      ssl: "Let’s Encrypt",
    },
    {
      hostname: "p-lis5uw.project.space",
      type: "Default-Domain",
      ssl: "Let’s Encrypt",
    },
  ];
  const DomainList = typedList<Domain>();

  const addDomainModal = (
    <Modal offCanvas>
      <Heading>Domain buchen</Heading>
      <Content>
        <Section>
          <Heading>Wunsch-Domain</Heading>
          <Text>
            Eine Liste der Top-Level-Domains findest du auf
            unserer{" "}
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
            „Kostenpflichtig buchen“ keinerlei Auswirkungen
            hat, da es sich um einen rein fiktiven
            Bestellprozess handelt. Es wird keine Bestellung
            ausgelöst und wir speichern keine Daten. Hier
            passiert nichts, daher sind AGBs und Datenschutz
            überflüssig.
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
  );

  return (
    <LayoutCard>
      <Section>
        {domains.length > 0 && (
          <DomainList.List batchSize={5}>
            <ActionGroup>
              <ModalTrigger>
                <Button color="accent">
                  Domain anlegen
                </Button>
                {addDomainModal}
              </ModalTrigger>
            </ActionGroup>
            <DomainList.StaticData data={domains} />
            <DomainList.Search />
            <DomainList.Sorting
              property="hostname"
              name="A bis Z"
              defaultEnabled
            />
            <DomainList.Sorting
              property="hostname"
              name="Z bis A"
              direction="desc"
            />
            <DomainList.Filter
              name="Filter"
              property="type"
            />

            <DomainList.Item
              textValue={(domain) => domain.hostname}
            >
              {(domain) => (
                <ListItemView>
                  <Avatar
                    color={
                      domain.type === "Domain"
                        ? "blue"
                        : domain.type === "Subdomain"
                          ? "teal"
                          : "lilac"
                    }
                  >
                    {domain.type === "Domain" ? (
                      <IconDomain />
                    ) : domain.type === "Subdomain" ? (
                      <IconSubdomain />
                    ) : (
                      <IconHome />
                    )}
                  </Avatar>
                  <Heading>
                    {domain.hostname}{" "}
                    {!domain.ssl && (
                      <AlertBadge status="danger">
                        SSL-Zertifikat
                      </AlertBadge>
                    )}
                  </Heading>
                  <Text>{domain.type}</Text>
                </ListItemView>
              )}
            </DomainList.Item>
          </DomainList.List>
        )}
      </Section>
    </LayoutCard>
  );
};
