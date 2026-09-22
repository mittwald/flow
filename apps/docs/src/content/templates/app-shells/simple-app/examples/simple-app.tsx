import {
  ActionGroup,
  Avatar,
  Button,
  CartesianChart,
  ChartGrid,
  ChartLegend,
  ChartTooltip,
  ColumnLayout,
  Combine,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  CounterBadge,
  DonutChart,
  Flex,
  Header,
  HeaderNavigation,
  Heading,
  Icon,
  IconLogout,
  IconMenu,
  IconNotification,
  IconSettings,
  Initials,
  LayoutCard,
  Line,
  Link,
  MenuItem,
  Message,
  MessageThread,
  Modal,
  ModalTrigger,
  Navigation,
  Rating,
  Section,
  Text,
  XAxis,
  YAxis,
} from "@mittwald/flow-react-components";
import {
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { MittwaldLogo } from "../../MittwaldLogo";
import styles from "./simple-app.module.css";

const contracts = [
  {
    month: "Jan",
    Webhosting: 33,
    vServer: 72,
    "Dedicated Server": 52,
  },
  {
    month: "Feb",
    Webhosting: 52,
    vServer: 84,
    "Dedicated Server": 80,
  },
  {
    month: "Mär",
    Webhosting: 62,
    vServer: 83,
    "Dedicated Server": 98,
  },
  {
    month: "Apr",
    Webhosting: 24,
    vServer: 63,
    "Dedicated Server": 42,
  },
  {
    month: "Mai",
    Webhosting: 70,
    vServer: 78,
    "Dedicated Server": 50,
  },
  {
    month: "Jun",
    Webhosting: 96,
    vServer: 88,
    "Dedicated Server": 54,
  },
  {
    month: "Jul",
    Webhosting: 146,
    vServer: 98,
    "Dedicated Server": 56,
  },
  {
    month: "Aug",
    Webhosting: 132,
    vServer: 85,
    "Dedicated Server": 90,
  },
  {
    month: "Sep",
    Webhosting: 114,
    vServer: 82,
    "Dedicated Server": 148,
  },
  {
    month: "Okt",
    Webhosting: 18,
    vServer: 42,
    "Dedicated Server": 120,
  },
  {
    month: "Nov",
    Webhosting: 48,
    vServer: 70,
    "Dedicated Server": 98,
  },
  {
    month: "Dez",
    Webhosting: 68,
    vServer: 110,
    "Dedicated Server": 126,
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
      <MittwaldLogo className={styles.logo} />
      <HeaderNavigation
        aria-label="Hauptnavigation"
        className={styles.nav}
      >
        <GlobalNavigationLinks />
        <NotificationButton />
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
      <HeaderNavigation className={styles.mobileActions}>
        <NotificationButton />
        <MobileMenu />
      </HeaderNavigation>
    </Flex>

    <Flex elementType="main" direction="column" gap="l">
      {/* The active area is already named in the navigation, so the page
          heading is only exposed to assistive technology. */}
      <Heading level={1} className={styles.visuallyHidden}>
        Dashboard
      </Heading>

      <ColumnLayout l={[1, 1]} m={[1]}>
        <ColumnLayout l={[1]} m={[1]}>
          <LayoutCard>
            <Section>
              <Heading>Neuverträge</Heading>
              <CartesianChart
                data={contracts}
                height="18rem"
              >
                <Line
                  dataKey="Webhosting"
                  color="sea-green"
                />
                <Line
                  dataKey="vServer"
                  color="palatinate-blue"
                />
                <Line
                  dataKey="Dedicated Server"
                  color="tangerine"
                />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 200]} />
                <ChartGrid />
                <ChartLegend />
                <ChartTooltip />
              </CartesianChart>
            </Section>
          </LayoutCard>

          <ColumnLayout l={[1, 1]} m={[1, 1]}>
            <LayoutCard>
              <Flex
                direction="column"
                align="center"
                gap="xs"
                className={styles.stat}
              >
                <Icon size="l" color="success">
                  <IconTrendingUp />
                </Icon>
                <span className={styles.statValue}>
                  + 2.000 €
                </span>
                <Text className={styles.statLabel}>
                  Vertragsbestand (30 Tage)
                </Text>
              </Flex>
            </LayoutCard>
            <LayoutCard>
              <Flex
                direction="column"
                align="center"
                gap="xs"
                className={styles.stat}
              >
                <Icon size="l" color="danger">
                  <IconTrendingDown />
                </Icon>
                <span className={styles.statValue}>40</span>
                <Text className={styles.statLabel}>
                  Neuverträge (30 Tage)
                </Text>
              </Flex>
            </LayoutCard>
          </ColumnLayout>

          <LayoutCard>
            <Section>
              <Heading>Vertragszusammensetzung</Heading>
              <DonutChart
                aria-label="Vertragszusammensetzung"
                size="l"
                legendPosition="bottom"
                maxValue={1200}
                formatOptions={{ style: "decimal" }}
                segments={[
                  {
                    title: "Webhosting",
                    value: 700,
                    color: "sea-green",
                  },
                  {
                    title: "vServer",
                    value: 300,
                    color: "palatinate-blue",
                  },
                  {
                    title: "Dedicated Server",
                    value: 200,
                    color: "tangerine",
                  },
                ]}
              >
                <strong>1,2 K</strong>
                <small>Gesamt</small>
              </DonutChart>
            </Section>
          </LayoutCard>
        </ColumnLayout>

        <LayoutCard>
          <Section>
            <Heading>Letzte Kundenfeedbacks</Heading>
            <MessageThread>
              <Feedback
                name="Lena Brinkmann"
                date="13.09.24, 10:40"
                rating={5}
                text="Der Umzug meiner drei WordPress-Seiten lief völlig reibungslos. Der Support hat sogar proaktiv nachgefragt, ob alles passt – klare Empfehlung."
              />
              <Feedback
                name="Jonas Weber"
                date="12.09.24, 16:12"
                rating={5}
                text="Performance ist top und das Backup-Handling hat mir bei einem eigenen Fehler den Tag gerettet. So stelle ich mir Hosting vor."
              />
              <Feedback
                name="Miriam Kessler"
                date="11.09.24, 09:03"
                rating={3}
                text="Technisch stark, aber die Ersteinrichtung war für mich als Umsteiger etwas zäh. Mit dem Support ging es dann zügig."
              />
              <Feedback
                name="Tobias Reinhardt"
                date="10.09.24, 14:27"
                rating={4}
                text="Faires Preis-Leistungs-Verhältnis und schnelle Reaktionszeiten. Das mStudio könnte an ein, zwei Stellen noch aufgeräumter sein."
              />
            </MessageThread>
          </Section>
        </LayoutCard>
      </ColumnLayout>
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

/*
 * The bell keeps its place next to the burger: a pending notification is worth
 * seeing without opening the menu first.
 */
const NotificationButton = () => (
  <Button aria-label="Benachrichtigungen">
    <IconNotification />
    <CounterBadge count={2} />
  </Button>
);

/*
 * The navigation links, shared by the top bar and the off-canvas. Each renders
 * them through its own props context, so the same Links read as a header bar
 * in one and as a navigation list in the other.
 */
const GlobalNavigationLinks = () => (
  <>
    <Link href="#" aria-current="page">
      Dashboard
    </Link>
    <Link href="#">Kündigungen</Link>
    <Link href="#">Vertragsbestand</Link>
  </>
);

/*
 * On a narrow screen the top bar has no room for the navigation, so it moves
 * in here. The burger is then the shell's only navigation control.
 */
const MobileMenu = () => (
  <ModalTrigger>
    <Button aria-label="Menü öffnen">
      <IconMenu />
    </Button>
    <Modal offCanvas showCloseButton>
      <Heading>Menü</Heading>
      <Content>
        <Navigation aria-label="Hauptnavigation">
          <GlobalNavigationLinks />
        </Navigation>
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

interface FeedbackProps {
  name: string;
  date: string;
  rating: number;
  text: string;
}

const Feedback = ({
  name,
  date,
  rating,
  text,
}: FeedbackProps) => (
  <Message>
    <Header>
      <Combine>
        <Avatar>
          <Initials>{name}</Initials>
        </Avatar>
        <Text>
          <strong>{name}</strong>
        </Text>
      </Combine>
      <Text>{date}</Text>
    </Header>
    <Content>
      <Rating
        value={rating}
        isReadOnly
        size="s"
        aria-label={`Bewertung: ${rating} von 5 Sternen`}
      />
      <Text>{text}</Text>
    </Content>
  </Message>
);
