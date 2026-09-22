import {
  Avatar,
  Badge,
  Button,
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

const statuses: Status[] = [
  "Bezahlt",
  "Offen",
  "Überfällig",
];
const customers = [
  "KD-1042",
  "KD-0987",
  "KD-1120",
  "KD-0765",
  "KD-1298",
  "KD-0553",
];

// Deterministic pseudo-randomness: the sample data should look unordered, but
// stay identical between the server and client render (Math.random would not).
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const pick = <T,>(options: readonly T[], seed: number): T =>
  options[Math.floor(pseudoRandom(seed) * options.length)];

// A page of invoices, one per day counting back from 30.09.2026, with enough
// rows to sort, filter and search through.
const invoices: Invoice[] = Array.from(
  { length: 20 },
  (_, i) => {
    const day = new Date(2026, 8, 30 - i);
    const yyyy = day.getFullYear();
    const mm = String(day.getMonth() + 1).padStart(2, "0");
    const dd = String(day.getDate()).padStart(2, "0");
    const value =
      90 + Math.floor(pseudoRandom(i + 50) * 3000);
    return {
      number: `RE-2026-${String(148 + i).padStart(4, "0")}`,
      customer: pick(customers, i + 1),
      createdAt: `${yyyy}-${mm}-${dd}`,
      date: `${dd}.${mm}.${yyyy}`,
      amount: value.toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR",
      }),
      status: pick(statuses, i + 100),
    };
  },
);

export default () => {
  const InvoiceList = typedList<Invoice>();

  return (
    <Flex direction="column" gap="l" className={styles.app}>
      <div className={styles.body}>
        <LayoutCard className={styles.sidebar}>
          <span
            className={styles.logo}
            role="img"
            aria-label="mittwald"
          />
          <AreaNavigation />
          <div className={styles.sidebarBottom}>
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
          </div>
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
      </div>

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
