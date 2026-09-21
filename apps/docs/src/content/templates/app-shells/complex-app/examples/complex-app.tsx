import {
  ActionGroup,
  Avatar,
  Breadcrumb,
  Button,
  ContextMenu,
  ContextMenuTrigger,
  Content,
  CounterBadge,
  Flex,
  Heading,
  HeaderNavigation,
  IconApp,
  IconCronjob,
  IconDashboard,
  IconDatabase,
  IconDomain,
  IconEmail,
  IconLogout,
  IconMember,
  IconMonitoring,
  IconNotification,
  IconSearch,
  IconSettings,
  IconSshSftp,
  IconSupport,
  Initials,
  Label,
  LayoutCard,
  Link,
  MenuItem,
  Navigation,
  NavigationGroup,
  ProgressBar,
  Text,
  typedList,
} from "@mittwald/flow-react-components";
import styles from "./complex-app.module.css";

interface Mailbox {
  id: string;
  address: string;
  type: string;
  color: "blue" | "teal" | "violet";
  storage?: { used: number; max: number };
}

const mailboxes: Mailbox[] = [
  {
    id: "1",
    address: "max.mustermann@mittwald.de",
    type: "E-Mail-Adresse",
    color: "blue",
    storage: { used: 1, max: 2 },
  },
  {
    id: "2",
    address: "kontakt@mittwald.de",
    type: "E-Mail-Adresse",
    color: "blue",
    storage: { used: 0.5, max: 2 },
  },
  {
    id: "3",
    address: "info@mittwald.de",
    type: "Weiterleitungsadresse",
    color: "teal",
  },
  {
    id: "4",
    address: "hallo@mittwald.de",
    type: "Catch-All-Adresse",
    color: "violet",
    storage: { used: 0, max: 2 },
  },
];

const MailboxList = typedList<Mailbox>();

export default () => (
  <Flex direction="column" gap="l" className={styles.app}>
    <Topbar />
    <Flex gap="l" align="stretch" className={styles.body}>
      <ProjectSidebar />
      <Flex
        elementType="main"
        direction="column"
        gap="m"
        className={styles.main}
      >
        <Breadcrumb>
          <Link href="#">Projekt</Link>
          <Link href="#">E-Mails</Link>
        </Breadcrumb>
        <Heading level={1}>E-Mails</Heading>
        <LayoutCard>
          <MailboxList.List
            batchSize={4}
            aria-label="E-Mail-Adressen"
            getItemId={(m) => m.id}
          >
            <MailboxList.StaticData data={mailboxes} />
            <ActionGroup>
              <Button>Anlegen</Button>
            </ActionGroup>
            <MailboxList.Search />
            <MailboxList.Filter
              property="type"
              name="Typ"
              mode="some"
            />
            <MailboxList.Sorting
              property="address"
              name="Alphabetisch"
              direction="asc"
              directionName="aufsteigend"
              defaultEnabled
            />
            <MailboxList.Sorting
              property="address"
              name="Alphabetisch"
              direction="desc"
              directionName="absteigend"
            />
            <MailboxList.Item textValue={(m) => m.address}>
              {(m) => (
                <MailboxList.ItemView
                  l={[3, 1]}
                  m={[2, 1]}
                  s={[1]}
                >
                  <Avatar color={m.color}>
                    <IconEmail />
                  </Avatar>
                  <Heading>{m.address}</Heading>
                  <Text>{m.type}</Text>
                  {m.storage && (
                    <Content>
                      <ProgressBar
                        size="s"
                        showMaxValue
                        value={m.storage.used}
                        maxValue={m.storage.max}
                        formatOptions={{
                          style: "unit",
                          unit: "gigabyte",
                        }}
                      >
                        <Label>Speicher</Label>
                      </ProgressBar>
                    </Content>
                  )}
                  <ContextMenu>
                    <MenuItem>Details anzeigen</MenuItem>
                    <MenuItem>Bearbeiten</MenuItem>
                    <MenuItem>Löschen</MenuItem>
                  </ContextMenu>
                </MailboxList.ItemView>
              )}
            </MailboxList.Item>
          </MailboxList.List>
        </LayoutCard>
      </Flex>
    </Flex>
    <Footer />
  </Flex>
);

const Topbar = () => (
  <Flex
    elementType="header"
    align="center"
    wrap="wrap"
    gap="m"
    className={styles.topbar}
  >
    <span
      className={styles.logo}
      role="img"
      aria-label="mittwald"
    />
    <HeaderNavigation
      aria-label="Hauptnavigation"
      className={styles.topnav}
    >
      <Link href="#">Dashboard</Link>
      <Link href="#">Organisation</Link>
      <Link href="#">Server</Link>
      <Link href="#" aria-current="page">
        Projekte
      </Link>
      <Button aria-label="Suche">
        <IconSearch />
      </Button>
      <Button aria-label="Support">
        <IconSupport />
      </Button>
      <Button
        aria-label="Benachrichtigungen"
        className={styles.notify}
      >
        <IconNotification />
        <CounterBadge
          count={2}
          className={styles.notifyBadge}
        />
      </Button>
      <ContextMenuTrigger>
        <Button aria-label="Konto">
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
    </HeaderNavigation>
  </Flex>
);

const ProjectSidebar = () => (
  <LayoutCard className={styles.sidebar}>
    <Heading level={2}>Mein Projekt</Heading>
    <Navigation aria-label="Projektnavigation">
      <NavigationGroup>
        <Label>Allgemein</Label>
        <Link href="#">
          <IconDashboard />
          <Text>Dashboard</Text>
        </Link>
        <Link href="#">
          <IconMonitoring />
          <Text>Monitoring</Text>
        </Link>
      </NavigationGroup>
      <NavigationGroup>
        <Label>Komponenten</Label>
        <Link href="#">
          <IconApp />
          <Text>Apps</Text>
        </Link>
        <Link href="#">
          <IconDomain />
          <Text>Domains</Text>
        </Link>
        <Link href="#" aria-current="page">
          <IconEmail />
          <Text>E-Mails</Text>
        </Link>
        <Link href="#">
          <IconDatabase />
          <Text>Datenbanken</Text>
        </Link>
        <Link href="#">
          <IconCronjob />
          <Text>Cronjobs</Text>
        </Link>
        <Link href="#">
          <IconSshSftp />
          <Text>SSH/SFTP</Text>
        </Link>
      </NavigationGroup>
      <NavigationGroup>
        <Label>Verwaltung</Label>
        <Link href="#">
          <IconMember />
          <Text>Mitglieder</Text>
        </Link>
        <Link href="#">
          <IconSettings />
          <Text>Einstellungen</Text>
        </Link>
      </NavigationGroup>
    </Navigation>
  </LayoutCard>
);

const Footer = () => (
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
);
