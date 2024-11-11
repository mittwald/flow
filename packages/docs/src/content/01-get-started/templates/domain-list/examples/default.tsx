import {
  ListItemView,
  typedList,
} from "@mittwald/flow-react-components/List";
import Avatar from "@mittwald/flow-react-components/Avatar";
import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import {
  IconDomain,
  IconHome,
  IconInvoice,
  IconSubdomain,
} from "@mittwald/flow-react-components/Icons";
import AlertBadge from "@mittwald/flow-react-components/AlertBadge";
import Button from "@mittwald/flow-react-components/Button";
import Section from "@mittwald/flow-react-components/Section";
import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Content from "@mittwald/flow-react-components/Content";
import Link from "@mittwald/flow-react-components/Link";
import TextField from "@mittwald/flow-react-components/TextField";
import Modal, {
  ModalTrigger,
} from "@mittwald/flow-react-components/Modal";
import Label from "@mittwald/flow-react-components/Label";
import Header from "@mittwald/flow-react-components/Header";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import Initials from "@mittwald/flow-react-components/Initials";
import Table, {
  TableBody,
  TableCell,
  TableColumn,
  TableFooterRow,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components/Table";
import CheckboxButton from "@mittwald/flow-react-components/CheckboxButton";
import { Action } from "@mittwald/flow-react-components/Action";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import { IllustratedMessage } from "@mittwald/flow-react-components/IllustratedMessage";

export default () => {
  interface Domain {
    id: string;
    hostname: string;
    domain: string;
    type: "Domain" | "Subdomain" | "Default-Domain";
    ssl?: string;
  }

  const domains: Domain[] = [
    {
      id: "1",
      hostname: "toujours.de",
      domain: "toujours.de",
      type: "Domain",
      ssl: "Let’s Encrypt",
    },
    {
      id: "2",
      hostname: "www.toujours.de",
      domain: "toujours.de",
      type: "Subdomain",
      ssl: "Let’s Encrypt",
    },
    {
      id: "3",
      hostname: "p-lis5uw.project.space",
      domain: "project.space",
      type: "Default-Domain",
      ssl: "Let’s Encrypt",
    },
    {
      id: "4",
      hostname: "example.de",
      domain: "example.de",
      type: "Domain",
    },
    {
      id: "5",
      hostname: "www.example.de",
      domain: "example.de",
      type: "Subdomain",
      ssl: "Let’s Encrypt",
    },
    {
      id: "6",
      hostname: "blog.example.de",
      domain: "example.de",
      type: "Subdomain",
      ssl: "Let’s Encrypt",
    },
  ];
  const DomainList = typedList<Domain>();

  return (
    <LayoutCard>
      <Section>
        {domains.length === 0 && (
          <IllustratedMessage>
            <IconDomain />
            <Heading>Keine Domains vorhanden</Heading>
            <Text>Lege jetzt deine erste Domain an.</Text>
            <Button>Domain anlegen</Button>
          </IllustratedMessage>
        )}
        {domains.length > 0 && (
          <DomainList.List batchSize={5}>
            <ActionGroup>
              <ModalTrigger>
                <Button color="accent">
                  Domain anlegen
                </Button>
                <Modal offCanvas>
                  <Heading>Domain anlegen</Heading>
                  <Content>
                    <Section>
                      <Heading>Wunsch-Domain</Heading>
                      <Text>
                        Eine Liste der Top-Level-Domains
                        findest du auf unserer{" "}
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
                    </Section>
                    <Section>
                      <Header>
                        <Heading>Domain-Inhaber</Heading>
                        <ModalTrigger>
                          <Button color="accent">
                            Hinzufügen
                          </Button>
                          <Modal>
                            <Heading>
                              Domain-Inhaber
                            </Heading>
                            <Content>
                              <Section>
                                <ColumnLayout>
                                  <TextField isRequired>
                                    <Label>Vorname</Label>
                                  </TextField>
                                  <TextField isRequired>
                                    <Label>Nachname</Label>
                                  </TextField>
                                  <ColumnLayout
                                    gap="s"
                                    s={[2, 1]}
                                  >
                                    <TextField isRequired>
                                      <Label>Straße</Label>
                                    </TextField>
                                    <TextField isRequired>
                                      <Label>Hausnr.</Label>
                                    </TextField>
                                  </ColumnLayout>
                                  <ColumnLayout
                                    gap="s"
                                    s={[1, 2]}
                                  >
                                    <TextField isRequired>
                                      <Label>PLZ</Label>
                                    </TextField>
                                    <TextField isRequired>
                                      <Label>Ort</Label>
                                    </TextField>
                                  </ColumnLayout>
                                </ColumnLayout>
                              </Section>
                            </Content>
                            <ActionGroup>
                              <Action closeOverlay="Modal">
                                <Button
                                  color="secondary"
                                  variant="soft"
                                >
                                  Abbrechen
                                </Button>
                                <Button color="accent">
                                  Domaininhaber hinzufügen
                                </Button>
                              </Action>
                            </ActionGroup>
                          </Modal>
                        </ModalTrigger>
                      </Header>
                      <Text>
                        Du hast noch keinen Domain-Inhaber
                        angelegt.
                      </Text>
                    </Section>
                    <Section>
                      <Heading>Bestellübersicht</Heading>
                      <ColumnLayout>
                        <div
                          style={{
                            display: "flex",
                            gap: "var(--size-px--s)",
                          }}
                        >
                          <Avatar>
                            <Initials>
                              Max Mustermann
                            </Initials>
                          </Avatar>
                          <Text>
                            <b>Meine Organisation</b>
                            <br />
                            Max Mustermann
                            <br />
                            Königsberger Str. 4, 32339
                            Espelkamp
                          </Text>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "var(--size-px--s)",
                          }}
                        >
                          <Avatar>
                            <IconInvoice />
                          </Avatar>
                          <Text>
                            <b>Rechnung</b>
                            <br />
                            Max Mustermann
                            <br />
                            Königsberger Str. 4, 32339
                            Espelkamp
                          </Text>
                        </div>
                      </ColumnLayout>
                      <Table>
                        <TableHeader>
                          <TableColumn>Artikel</TableColumn>
                          <TableColumn>Preis</TableColumn>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              Beispiel Domain
                            </TableCell>
                            <TableCell>0,00 €</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              Einrichtungsgebühr
                            </TableCell>
                            <TableCell>0,00 €</TableCell>
                          </TableRow>
                          <TableFooterRow>
                            <TableCell>
                              Gesamtpreis
                            </TableCell>
                            <TableCell>0,00 €</TableCell>
                          </TableFooterRow>
                        </TableBody>
                      </Table>
                      <CheckboxButton isRequired>
                        Ich verstehe, dass ein Klick auf
                        “Kostenpflichtig buchen” keinerlei
                        Auswirkungen hat, da es sich um
                        einen rein fiktiven Bestellprozess
                        handelt. Es wird keine Bestellung
                        ausgelöst und wir speichern keine
                        Daten. Hier passiert nichts, daher
                        sind AGBs und Datenschutz
                        überflüssig.
                      </CheckboxButton>
                    </Section>
                  </Content>
                  <ActionGroup>
                    <Action closeOverlay="Modal">
                      <Button
                        color="secondary"
                        variant="soft"
                      >
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
            </ActionGroup>
            <DomainList.StaticData data={domains} />
            <DomainList.Search />
            <DomainList.Sorting
              property="domain"
              name="A bis Z"
              defaultEnabled
            />
            <DomainList.Sorting
              property="domain"
              name="Z bis A"
              direction="desc"
            />
            <DomainList.Filter
              name="Filter"
              property="type"
            />

            <DomainList.Item>
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
                    {domain.hostname}
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
