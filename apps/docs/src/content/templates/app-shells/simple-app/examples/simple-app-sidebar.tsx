import {
  Avatar,
  Badge,
  Button,
  ColumnLayout,
  Combine,
  CounterBadge,
  Flex,
  Heading,
  IconCustomer,
  IconDashboard,
  IconInvoice,
  IconLogout,
  IconNotification,
  IconPayment,
  IconQuote,
  IconSettings,
  Initials,
  LayoutCard,
  Link,
  Navigation,
  Section,
  Text,
  typedList,
} from "@mittwald/flow-react-components";
import styles from "./simple-app-sidebar.module.css";

type Status = "Bezahlt" | "Offen" | "Überfällig";

const statusColor: Record<
  Status,
  "green" | "neutral" | "red"
> = {
  Bezahlt: "green",
  Offen: "neutral",
  Überfällig: "red",
};

interface Invoice {
  number: string;
  customer: string;
  createdAt: string; // ISO date, sorted on
  date: string; // formatted for display
  amount: string;
  status: Status;
}

// A page of invoices, one per day counting back from 30.09.2026, with enough
// rows to sort, filter and search through.
const invoices: Invoice[] = [
  {
    number: "RE-2026-0148",
    customer: "KD-1298",
    createdAt: "2026-09-30",
    date: "30.09.2026",
    amount: "844,00 €",
    status: "Offen",
  },
  {
    number: "RE-2026-0149",
    customer: "KD-0553",
    createdAt: "2026-09-29",
    date: "29.09.2026",
    amount: "965,00 €",
    status: "Bezahlt",
  },
  {
    number: "RE-2026-0150",
    customer: "KD-0987",
    createdAt: "2026-09-28",
    date: "28.09.2026",
    amount: "917,00 €",
    status: "Bezahlt",
  },
  {
    number: "RE-2026-0151",
    customer: "KD-0553",
    createdAt: "2026-09-27",
    date: "27.09.2026",
    amount: "844,00 €",
    status: "Überfällig",
  },
  {
    number: "RE-2026-0152",
    customer: "KD-1298",
    createdAt: "2026-09-26",
    date: "26.09.2026",
    amount: "418,00 €",
    status: "Überfällig",
  },
  {
    number: "RE-2026-0153",
    customer: "KD-0553",
    createdAt: "2026-09-25",
    date: "25.09.2026",
    amount: "1.434,00 €",
    status: "Offen",
  },
  {
    number: "RE-2026-0154",
    customer: "KD-0553",
    createdAt: "2026-09-24",
    date: "24.09.2026",
    amount: "1.559,00 €",
    status: "Offen",
  },
  {
    number: "RE-2026-0155",
    customer: "KD-0765",
    createdAt: "2026-09-23",
    date: "23.09.2026",
    amount: "2.032,00 €",
    status: "Überfällig",
  },
  {
    number: "RE-2026-0156",
    customer: "KD-0987",
    createdAt: "2026-09-22",
    date: "22.09.2026",
    amount: "2.269,00 €",
    status: "Bezahlt",
  },
  {
    number: "RE-2026-0157",
    customer: "KD-1298",
    createdAt: "2026-09-21",
    date: "21.09.2026",
    amount: "1.230,00 €",
    status: "Offen",
  },
  {
    number: "RE-2026-0158",
    customer: "KD-1042",
    createdAt: "2026-09-20",
    date: "20.09.2026",
    amount: "2.771,00 €",
    status: "Offen",
  },
  {
    number: "RE-2026-0159",
    customer: "KD-0987",
    createdAt: "2026-09-19",
    date: "19.09.2026",
    amount: "2.556,00 €",
    status: "Offen",
  },
  {
    number: "RE-2026-0160",
    customer: "KD-1298",
    createdAt: "2026-09-18",
    date: "18.09.2026",
    amount: "669,00 €",
    status: "Bezahlt",
  },
  {
    number: "RE-2026-0161",
    customer: "KD-1042",
    createdAt: "2026-09-17",
    date: "17.09.2026",
    amount: "1.761,00 €",
    status: "Bezahlt",
  },
  {
    number: "RE-2026-0162",
    customer: "KD-0553",
    createdAt: "2026-09-16",
    date: "16.09.2026",
    amount: "871,00 €",
    status: "Überfällig",
  },
  {
    number: "RE-2026-0163",
    customer: "KD-0553",
    createdAt: "2026-09-15",
    date: "15.09.2026",
    amount: "950,00 €",
    status: "Offen",
  },
  {
    number: "RE-2026-0164",
    customer: "KD-1042",
    createdAt: "2026-09-14",
    date: "14.09.2026",
    amount: "1.555,00 €",
    status: "Offen",
  },
  {
    number: "RE-2026-0165",
    customer: "KD-1042",
    createdAt: "2026-09-13",
    date: "13.09.2026",
    amount: "2.490,00 €",
    status: "Bezahlt",
  },
  {
    number: "RE-2026-0166",
    customer: "KD-1298",
    createdAt: "2026-09-12",
    date: "12.09.2026",
    amount: "2.259,00 €",
    status: "Offen",
  },
  {
    number: "RE-2026-0167",
    customer: "KD-1120",
    createdAt: "2026-09-11",
    date: "11.09.2026",
    amount: "545,00 €",
    status: "Überfällig",
  },
];

export default () => {
  const InvoiceList = typedList<Invoice>();

  return (
    <Flex direction="column" gap="l" className={styles.app}>
      <ColumnLayout
        l={[1, 3]}
        m={[1, 2]}
        gap="l"
        className={styles.body}
      >
        <LayoutCard className={styles.sidebar}>
          <span
            className={styles.logo}
            role="img"
            aria-label="mittwald"
          />
          <AreaNavigation />
          <Flex
            direction="column"
            gap="m"
            className={styles.sidebarBottom}
          >
            <AdminNavigation />
            {/* The current user sits at the very bottom of the sidebar. */}
            <Flex
              align="center"
              justify="space-between"
              gap="s"
            >
              <Combine>
                <Avatar>
                  <Initials>Max Mustermann</Initials>
                </Avatar>
                <Text>Max Mustermann</Text>
              </Combine>
              <Button
                variant="plain"
                color="secondary"
                aria-label="Abmelden"
              >
                <IconLogout />
              </Button>
            </Flex>
          </Flex>
        </LayoutCard>

        <Flex
          elementType="main"
          direction="column"
          gap="m"
          className={styles.main}
        >
          {/* The active area is already named in the navigation, so the page
            heading is only exposed to assistive technology. */}
          <Heading
            level={1}
            className={styles.visuallyHidden}
          >
            Rechnungen
          </Heading>

          <LayoutCard className={styles.contentCard}>
            <Section>
              <InvoiceList.List
                aria-label="Rechnungen"
                defaultViewMode="table"
                batchSize={20}
                getItemId={(invoice) => invoice.number}
              >
                <InvoiceList.StaticData data={invoices} />
                <InvoiceList.Search />
                <InvoiceList.Filter
                  property="status"
                  mode="some"
                  name="Status"
                />
                <InvoiceList.Sorting
                  property="createdAt"
                  name="Erstelldatum"
                  direction="desc"
                  directionName="absteigend"
                  defaultEnabled
                />
                <InvoiceList.Sorting
                  property="createdAt"
                  name="Erstelldatum"
                  direction="asc"
                  directionName="aufsteigend"
                />
                <InvoiceList.Table>
                  <InvoiceList.TableHeader>
                    <InvoiceList.TableColumn>
                      Rechnungsnummer
                    </InvoiceList.TableColumn>
                    <InvoiceList.TableColumn>
                      Kundennummer
                    </InvoiceList.TableColumn>
                    <InvoiceList.TableColumn>
                      Ausstellungsdatum
                    </InvoiceList.TableColumn>
                    <InvoiceList.TableColumn>
                      Betrag
                    </InvoiceList.TableColumn>
                    <InvoiceList.TableColumn>
                      Status
                    </InvoiceList.TableColumn>
                  </InvoiceList.TableHeader>

                  <InvoiceList.TableBody>
                    <InvoiceList.TableRow>
                      <InvoiceList.TableCell>
                        {(invoice) => invoice.number}
                      </InvoiceList.TableCell>
                      <InvoiceList.TableCell>
                        {(invoice) => invoice.customer}
                      </InvoiceList.TableCell>
                      <InvoiceList.TableCell>
                        {(invoice) => invoice.date}
                      </InvoiceList.TableCell>
                      <InvoiceList.TableCell>
                        {(invoice) => invoice.amount}
                      </InvoiceList.TableCell>
                      <InvoiceList.TableCell>
                        {(invoice) => (
                          <Badge
                            color={
                              statusColor[invoice.status]
                            }
                          >
                            {invoice.status}
                          </Badge>
                        )}
                      </InvoiceList.TableCell>
                    </InvoiceList.TableRow>
                  </InvoiceList.TableBody>
                </InvoiceList.Table>
              </InvoiceList.List>
            </Section>
          </LayoutCard>
        </Flex>
      </ColumnLayout>

      <Flex
        elementType="footer"
        justify="center"
        wrap="wrap"
        gap="l"
        className={styles.footer}
      >
        <Link href="#" target="_blank" color="dark">
          Datenschutz
        </Link>
        <Link href="#" target="_blank" color="dark">
          Impressum
        </Link>
      </Flex>
    </Flex>
  );
};

/*
 * The flat list of equal-ranking areas — the single navigation level of a
 * Simple App, moved from the header into the sidebar.
 */
const AreaNavigation = () => (
  <Navigation aria-label="Bereiche">
    <Link href="#">
      <IconDashboard />
      <Text>Dashboard</Text>
    </Link>
    <Link href="#" aria-current="page">
      <IconInvoice />
      <Text>Rechnungen</Text>
    </Link>
    <Link href="#">
      <IconQuote />
      <Text>Angebote</Text>
    </Link>
    <Link href="#">
      <IconCustomer />
      <Text>Kunden</Text>
    </Link>
    <Link href="#">
      <IconPayment />
      <Text>Zahlungseingang</Text>
    </Link>
  </Navigation>
);

/*
 * Supplementary points that would be out of place among the areas. They sit
 * apart from the flat list above.
 */
const AdminNavigation = () => (
  <Navigation aria-label="Verwaltung">
    <Link href="#">
      <IconNotification />
      <Text>Benachrichtigungen</Text>
      <CounterBadge count={2} />
    </Link>
    <Link href="#">
      <IconSettings />
      <Text>Einstellungen</Text>
    </Link>
  </Navigation>
);
