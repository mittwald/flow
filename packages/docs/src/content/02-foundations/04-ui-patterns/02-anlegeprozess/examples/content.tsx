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
        </Section>
        <Section>
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
              <Avatar color="blue">
                <Initials>Max Mustermann</Initials>
              </Avatar>
              <Text>
                <b>Meine Organisation</b>
                <br />
                Max Mustermann
                <br />
                Königsberger Str. 4, 32339 Espelkamp
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                gap: "var(--size-px--s)",
              }}
            >
              <Avatar color="blue">
                <IconInvoice />
              </Avatar>
              <Text>
                <b>Rechnung</b>
                <br />
                Max Mustermann
                <br />
                Königsberger Str. 4, 32339 Espelkamp
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
            “Kostenpflichtig buchen” keinerlei Auswirkungen
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
