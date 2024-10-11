"use client";
import Avatar from "@mittwald/flow-react-components/Avatar";
import Heading from "@mittwald/flow-react-components/Heading";
import { typedList } from "@mittwald/flow-react-components/List";
import Section from "@mittwald/flow-react-components/Section";
import Text from "@mittwald/flow-react-components/Text";
import styles from "@/app/layout.module.scss";
import Breadcrumb from "@mittwald/flow-react-components/Breadcrumb";
import Link from "@mittwald/flow-react-components/Link";
import LayoutCard from "@mittwald/flow-react-components/LayoutCard";
import { IconInvoice } from "@mittwald/flow-react-components/Icons";
import type { Invoice } from "@/api/invoiceApi";
import { listInvoices } from "@/api/invoiceApi";

export default function Page() {
  const InvoiceList = typedList<Invoice>();
  const invoices = listInvoices();

  return (
    <>
      <Breadcrumb color="light">
        <Link href="/customer">Organisation</Link>
        <Link>Rechnungen</Link>
      </Breadcrumb>
      <Heading level={1} color="light">
        Rechnungen
      </Heading>
      <LayoutCard className={styles.content}>
        <Section>
          <InvoiceList.List defaultViewMode="table">
            <InvoiceList.StaticData data={invoices} />
            <InvoiceList.Search autoFocus />

            <InvoiceList.Sorting
              property="date"
              name="Datum absteigend"
              direction="desc"
            />
            <InvoiceList.Sorting property="date" name="Datum aufsteigend" />

            <InvoiceList.Table>
              <InvoiceList.TableHeader>
                <InvoiceList.TableColumn>Name</InvoiceList.TableColumn>
                <InvoiceList.TableColumn>Datum</InvoiceList.TableColumn>
                <InvoiceList.TableColumn>Betrag</InvoiceList.TableColumn>
              </InvoiceList.TableHeader>

              <InvoiceList.TableBody>
                <InvoiceList.TableRow>
                  <InvoiceList.TableCell>
                    {(invoice) => invoice.name}
                  </InvoiceList.TableCell>
                  <InvoiceList.TableCell>
                    {(invoice) => invoice.date}
                  </InvoiceList.TableCell>
                  <InvoiceList.TableCell>
                    {(invoice) => invoice.amount}
                  </InvoiceList.TableCell>
                </InvoiceList.TableRow>
              </InvoiceList.TableBody>
            </InvoiceList.Table>

            <InvoiceList.Item textValue={(invoice) => invoice.name}>
              {(invoice) => (
                <InvoiceList.ItemView>
                  <Avatar color="blue">
                    <IconInvoice />
                  </Avatar>
                  <Heading>{invoice.name}</Heading>
                  <Text>
                    {invoice.date} - {invoice.amount}
                  </Text>
                </InvoiceList.ItemView>
              )}
            </InvoiceList.Item>
          </InvoiceList.List>
        </Section>
      </LayoutCard>
    </>
  );
}
