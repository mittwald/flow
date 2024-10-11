import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Button from "@mittwald/flow-react-components/Button";
import Content from "@mittwald/flow-react-components/Content";
import Heading from "@mittwald/flow-react-components/Heading";
import Label from "@mittwald/flow-react-components/Label";
import Modal from "@mittwald/flow-react-components/Modal";
import Text from "@mittwald/flow-react-components/Text";
import Link from "@mittwald/flow-react-components/Link";
import Section from "@mittwald/flow-react-components/Section";
import TextField from "@mittwald/flow-react-components/TextField";
import type { FC } from "react";
import Header from "@mittwald/flow-react-components/Header";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { Avatar } from "@mittwald/flow-react-components/Avatar";
import { Initials } from "@mittwald/flow-react-components/Initials";
import { getCustomer } from "@/api/customerApi";
import { ContractPartnerText } from "@/app/customer/_components/ContractPartnerText";
import { DetailedInformation } from "@/app/_components/DetailedInformation";
import { IconInvoice } from "@mittwald/flow-react-components/Icons";
import { InvoiceSettingsText } from "@/app/customer/_components/InvoiceSettingsText";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableFooterRow,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components/Table";
import { CheckboxButton } from "@mittwald/flow-react-components/CheckboxButton";
import { Action } from "@mittwald/flow-react-components/Action";

export const AddDomainModal: FC = () => {
  const customer = getCustomer();

  return (
    <Modal offCanvas>
      <Heading>Domain anlegen</Heading>
      <Content>
        <Section>
          <Heading>Wunsch-Domain</Heading>
          <Text>
            Eine Liste der Top-Level-Domains findest du auf unserer{" "}
            <Link href="https://www.mittwald.de/produkte/domains">
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
            <Button color="accent">Hinzufügen</Button>
          </Header>
          <Text>Du hast noch keinen Domain-Inhaber angelegt.</Text>
        </Section>
        <Section>
          <Heading>Bestellübersicht</Heading>
          <ColumnLayout>
            <DetailedInformation>
              <Avatar>
                <Initials>{customer.name}</Initials>
              </Avatar>
              <Text>
                <b>{customer.name}</b>
                <br />
                <ContractPartnerText
                  contractPartner={customer.contractPartner}
                />
              </Text>
            </DetailedInformation>
            <DetailedInformation>
              <Avatar>
                <IconInvoice />
              </Avatar>
              <InvoiceSettingsText invoiceSettings={customer.invoiceSettings} />
            </DetailedInformation>
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
            Ich verstehe, dass ein Klick auf “Kostenpflichtig buchen” keinerlei
            Auswirkungen hat, da es sich um einen rein fiktiven Bestellprozess
            handelt. Es wird keine Bestellung ausgelöst und wir speichern keine
            Daten. Hier passiert nichts, daher sind AGBs und Datenschutz
            überflüssig.
          </CheckboxButton>
        </Section>
      </Content>
      <ActionGroup>
        <Action closeOverlay="Modal">
          <Button color="secondary" variant="soft">
            Abbrechen
          </Button>
          <Button color="accent">Kostenpflichtig bestellen</Button>{" "}
        </Action>
      </ActionGroup>
    </Modal>
  );
};
