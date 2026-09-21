import {
  ActionGroup,
  Avatar,
  Badge,
  Button,
  ContextMenu,
  ContextMenuTrigger,
  Content,
  CounterBadge,
  Flex,
  Heading,
  IconCustomer,
  IconDashboard,
  IconInvoice,
  IconLogout,
  IconMenu,
  IconNotification,
  IconPayment,
  IconQuote,
  IconSettings,
  Initials,
  LayoutCard,
  Link,
  MenuItem,
  Modal,
  ModalTrigger,
  Navigation,
  Section,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Text,
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
  date: string;
  amount: string;
  status: Status;
}

const invoices: Invoice[] = [
  {
    number: "RE-2026-0148",
    customer: "KD-1042",
    date: "03.09.2026",
    amount: "1.290,00 €",
    status: "Bezahlt",
  },
  {
    number: "RE-2026-0149",
    customer: "KD-0987",
    date: "05.09.2026",
    amount: "540,00 €",
    status: "Offen",
  },
  {
    number: "RE-2026-0150",
    customer: "KD-1120",
    date: "28.08.2026",
    amount: "2.310,00 €",
    status: "Überfällig",
  },
  {
    number: "RE-2026-0151",
    customer: "KD-1042",
    date: "10.09.2026",
    amount: "780,00 €",
    status: "Offen",
  },
  {
    number: "RE-2026-0152",
    customer: "KD-0765",
    date: "12.09.2026",
    amount: "96,00 €",
    status: "Bezahlt",
  },
];

export default () => (
  <Flex direction="column" gap="l" className={styles.app}>
    <Flex
      elementType="header"
      align="center"
      wrap="wrap"
      gap="m"
    >
      <span
        className={styles.logo}
        role="img"
        aria-label="mittwald"
      />
      {/* The reduced top bar carries only global functions, no navigation. */}
      <Flex
        align="center"
        gap="s"
        className={styles.utility}
      >
        <NotificationButton />
        <ContextMenuTrigger>
          <Button aria-label="Nutzerprofil">
            <Avatar>
              <Initials>Max Mustermann</Initials>
            </Avatar>
          </Button>
          <ContextMenu>
            <MenuItem>
              <IconSettings />
              <Text>Profil</Text>
            </MenuItem>
            <MenuItem>
              <IconLogout />
              <Text>Abmelden</Text>
            </MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
      </Flex>
      <Flex
        align="center"
        gap="s"
        className={styles.mobileActions}
      >
        <NotificationButton />
        <MobileMenu />
      </Flex>
    </Flex>

    <Flex gap="l" align="stretch" className={styles.body}>
      <LayoutCard className={styles.sidebar}>
        <AreaNavigation />
        <div className={styles.sidebarBottom}>
          <AdminNavigation />
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

        <LayoutCard>
          <Section>
            <Heading>Rechnungen</Heading>
            <Table aria-label="Rechnungen">
              <TableHeader>
                <TableColumn>Rechnungsnummer</TableColumn>
                <TableColumn>Kundennummer</TableColumn>
                <TableColumn>Ausstellungsdatum</TableColumn>
                <TableColumn>Betrag</TableColumn>
                <TableColumn>Status</TableColumn>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.number}>
                    <TableCell>{invoice.number}</TableCell>
                    <TableCell>
                      {invoice.customer}
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <Badge
                        color={statusColor[invoice.status]}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>
        </LayoutCard>
      </Flex>
    </Flex>

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

const NotificationButton = () => (
  <Button
    variant="plain"
    color="secondary"
    aria-label="Benachrichtigungen"
    className={styles.notify}
  >
    <IconNotification />
    <CounterBadge
      count={2}
      className={styles.notifyBadge}
    />
  </Button>
);

/*
 * The flat list of equal-ranking areas. Shared by the sidebar and the
 * off-canvas, so the same links read as a sidebar on wide screens and as a
 * navigation list behind the burger on narrow ones.
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
 * Supplementary points that would be out of place in a header. They sit apart
 * from the flat list of areas above.
 */
const AdminNavigation = () => (
  <Navigation aria-label="Verwaltung">
    <Link href="#">
      <IconSettings />
      <Text>Einstellungen</Text>
    </Link>
  </Navigation>
);

/*
 * On a narrow screen the sidebar has no column of its own, so its navigation
 * moves in here. The burger is then the shell's only navigation control.
 */
const MobileMenu = () => (
  <ModalTrigger>
    <Button
      variant="plain"
      color="secondary"
      aria-label="Menü öffnen"
    >
      <IconMenu />
    </Button>
    <Modal offCanvas showCloseButton>
      <Heading>Menü</Heading>
      <Content>
        <Section>
          <AreaNavigation />
        </Section>
        <Section>
          <AdminNavigation />
        </Section>
      </Content>
      <ActionGroup>
        <Button variant="soft" color="secondary">
          <IconLogout />
          <Text>Abmelden</Text>
        </Button>
      </ActionGroup>
    </Modal>
  </ModalTrigger>
);
