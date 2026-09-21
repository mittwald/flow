import {
  ActionGroup,
  Avatar,
  Breadcrumb,
  Button,
  ColumnLayout,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  CounterBadge,
  Flex,
  Header,
  HeaderNavigation,
  Heading,
  IconApp,
  IconCronjob,
  IconDashboard,
  IconDatabase,
  IconDomain,
  IconEmail,
  IconLogout,
  IconMember,
  IconMenu,
  IconMonitoring,
  IconNotification,
  IconSearch,
  IconSettings,
  IconSshSftp,
  IconSupport,
  Initials,
  InlineCode,
  Label,
  LabeledValue,
  LayoutCard,
  Link,
  MenuItem,
  Modal,
  ModalTrigger,
  Navigation,
  NavigationGroup,
  ProgressBar,
  Section,
  Switch,
  Tab,
  TabNavigation,
  Tabs,
  TabTitle,
  Text,
} from "@mittwald/flow-react-components";
import styles from "./complex-app-detail.module.css";

const connections = {
  imap: {
    server: "imap.mittwald.de",
    port: "993 (SSL/TLS)",
  },
  pop3: {
    server: "pop3.mittwald.de",
    port: "995 (SSL/TLS)",
  },
  smtp: {
    server: "smtp.mittwald.de",
    port: "465 (SSL/TLS)",
  },
};

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
          <Link href="#">E-Mail-Details</Link>
        </Breadcrumb>
        <Heading level={1}>
          max.mustermann@mittwald.de
        </Heading>
        <LayoutCard>
          <TabNavigation aria-label="E-Mail-Bereiche">
            <Link href="#" aria-current="page">
              Allgemein
            </Link>
            <Link href="#">Weiterleitungen</Link>
            <Link href="#">Autoresponder</Link>
          </TabNavigation>
          <Section>
            <Header>
              <Heading>E-Mail-Adresse</Heading>
              <Button variant="soft" color="secondary">
                Passwort ändern
              </Button>
              <Button>E-Mail-Adresse bearbeiten</Button>
            </Header>
            <LabeledValue>
              <Label>E-Mail-Adresse</Label>
              <Content>max.mustermann@mittwald.de</Content>
            </LabeledValue>
            <LabeledValue>
              <Label>Webmailer</Label>
              <Link href="#" target="_blank">
                mittwald Webmailer
              </Link>
            </LabeledValue>
          </Section>

          <Section>
            <Header>
              <Heading>Speicherplatz</Heading>
              <Button variant="soft" color="secondary">
                Bearbeiten
              </Button>
            </Header>
            <Text>
              Die E-Mail-Adresse verfügt über Speicherplatz
              zum Empfangen und Speichern von E-Mails. Wir
              empfehlen mindestens 2 GB.
            </Text>
            <ProgressBar
              showMaxValue
              value={1}
              maxValue={2}
              formatOptions={{
                style: "unit",
                unit: "gigabyte",
              }}
            >
              <Label>Speicherplatz</Label>
            </ProgressBar>
          </Section>

          <Section>
            <Heading>Verbindungsinformationen</Heading>
            <Tabs aria-label="Verbindungsprotokoll">
              {Object.entries(connections).map(
                ([key, c]) => (
                  <Tab key={key} id={key}>
                    <TabTitle>{key.toUpperCase()}</TabTitle>
                    <ColumnLayout>
                      <LabeledValue>
                        <Label>Benutzername</Label>
                        <InlineCode>
                          max.mustermann@mittwald.de
                        </InlineCode>
                      </LabeledValue>
                      <LabeledValue>
                        <Label>Server</Label>
                        <InlineCode>{c.server}</InlineCode>
                      </LabeledValue>
                      <LabeledValue>
                        <Label>Port</Label>
                        <InlineCode>{c.port}</InlineCode>
                      </LabeledValue>
                    </ColumnLayout>
                  </Tab>
                ),
              )}
            </Tabs>
          </Section>

          <Section>
            <Header>
              <Heading>Spamschutz</Heading>
              <Switch defaultSelected>
                <Label>Aktivieren</Label>
              </Switch>
            </Header>
            <Text>
              Der Spamfilter schützt dich vor ungewollten
              E-Mails. Wir empfehlen, ihn immer aktiviert zu
              lassen.
            </Text>
          </Section>
        </LayoutCard>
      </Flex>
    </Flex>
    <Footer />
  </Flex>
);

/*
 * The global navigation links, shared by the top bar and the off-canvas. Each
 * renders them through its own props context, so the same Links read as a
 * header bar in one and as a navigation list in the other.
 */
const GlobalNavigationLinks = () => (
  <>
    <Link href="#">Dashboard</Link>
    <Link href="#">Organisation</Link>
    <Link href="#">Server</Link>
    <Link href="#" aria-current="page">
      Projekte
    </Link>
  </>
);

const Topbar = () => (
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
    <HeaderNavigation
      aria-label="Hauptnavigation"
      className={styles.topnav}
    >
      <GlobalNavigationLinks />
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
    <MobileMenu />
  </Flex>
);

/*
 * On a narrow screen the top bar has no room for the navigation and the
 * sidebar has no column of its own, so both move in here. The burger is then
 * the shell's only navigation control.
 */
const MobileMenu = () => (
  <ModalTrigger>
    <Button
      variant="plain"
      color="secondary"
      aria-label="Menü öffnen"
      className={styles.menuButton}
    >
      <IconMenu />
    </Button>
    <Modal offCanvas showCloseButton>
      <Heading>Menü</Heading>
      <Content>
        <Section>
          <Navigation aria-label="Hauptnavigation">
            <GlobalNavigationLinks />
          </Navigation>
        </Section>
        <Section>
          <Heading>Mein Projekt</Heading>
          <ProjectNavigation />
        </Section>
      </Content>
      <ActionGroup>
        <Button variant="soft" color="secondary">
          <IconSearch />
          <Text>Suche</Text>
        </Button>
        <Button variant="soft" color="secondary">
          <IconSupport />
          <Text>Support</Text>
        </Button>
        <Button variant="soft" color="secondary">
          <IconLogout />
          <Text>Abmelden</Text>
        </Button>
      </ActionGroup>
    </Modal>
  </ModalTrigger>
);

const ProjectSidebar = () => (
  <LayoutCard className={styles.sidebar}>
    <Heading level={2}>Mein Projekt</Heading>
    <ProjectNavigation />
  </LayoutCard>
);

const ProjectNavigation = () => (
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
