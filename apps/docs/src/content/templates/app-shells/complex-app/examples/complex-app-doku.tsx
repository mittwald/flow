import {
  ActionGroup,
  Badge,
  Button,
  Content,
  Flex,
  HeaderNavigation,
  Heading,
  Icon,
  IconMenu,
  IconSearch,
  Label,
  LayoutCard,
  Link,
  Modal,
  ModalTrigger,
  Navigation,
  NavigationGroup,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import { IconContrastFilled } from "@tabler/icons-react";
import styles from "./complex-app-doku.module.css";

const lorem =
  "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.";

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
      <HeaderNavigation
        aria-label="Hauptnavigation"
        className={styles.topnav}
      >
        <GlobalNavigationLinks />
        <SearchButton />
        <Button aria-label="Theme wechseln">
          <Icon>
            <IconContrastFilled />
          </Icon>
        </Button>
      </HeaderNavigation>
      <HeaderNavigation className={styles.mobileActions}>
        <SearchButton />
        <MobileMenu />
      </HeaderNavigation>
    </Flex>

    <Flex
      gap="l"
      wrap="wrap"
      align="stretch"
      className={styles.body}
    >
      <LayoutCard className={styles.sidebar}>
        <ComponentNavigation />
      </LayoutCard>

      <LayoutCard
        elementType="main"
        className={styles.main}
      >
        <Section>
          <Heading level={1}>Button</Heading>
          <Text>{lorem}</Text>
          <Heading level={2}>Colors</Heading>
          <Text>{lorem}</Text>
          <Heading level={3}>Light und Dark</Heading>
          <Text>{lorem}</Text>
          <Heading level={2}>Sizes</Heading>
          <Text>{lorem}</Text>
          <Heading level={2}>Variants</Heading>
          <Text>{lorem}</Text>
        </Section>
      </LayoutCard>

      <LayoutCard className={styles.toc}>
        <Section>
          <Heading level={4}>Auf dieser Seite</Heading>
          <Navigation aria-label="Auf dieser Seite">
            <Link href="#" aria-current="page">
              Button
            </Link>
            <Link href="#">Colors</Link>
            <Link href="#">Light und Dark</Link>
            <Link href="#">Sizes</Link>
            <Link href="#">Variants</Link>
          </Navigation>
        </Section>
      </LayoutCard>
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
 * Search keeps its place next to the burger: it is worth reaching without
 * opening the menu first.
 */
const SearchButton = () => (
  <Button
    variant="plain"
    color="secondary"
    aria-label="Suche"
  >
    <IconSearch />
  </Button>
);

/*
 * The section links, shared by the top bar and the off-canvas. Each renders
 * them through its own props context, so the same Links read as a header bar
 * in one and as a navigation list in the other.
 */
const GlobalNavigationLinks = () => (
  <>
    <Link href="#">Get Started</Link>
    <Link href="#">Foundations</Link>
    <Link href="#">Templates</Link>
    <Link href="#" aria-current="page">
      Components
    </Link>
  </>
);

const ComponentNavigation = () => (
  <Navigation aria-label="Komponenten">
    <NavigationGroup>
      <Label>Actions</Label>
      <Link href="#">Action</Link>
      <Link href="#">ActionGroup</Link>
      <Link href="#" aria-current="page">
        Button
      </Link>
      <Link href="#">ContextMenu</Link>
    </NavigationGroup>
    <NavigationGroup>
      <Label>Form Controls</Label>
      <Link href="#">Autocomplete</Link>
      <Link href="#">Checkbox</Link>
      <Link href="#">CheckboxButton</Link>
      <Link href="#">
        <Text>CodeEditor</Text>
        <Badge color="blue">Neu</Badge>
      </Link>
      <Link href="#">Combobox</Link>
      <Link href="#">DatePicker</Link>
      <Link href="#">Select</Link>
      <Link href="#">Switch</Link>
    </NavigationGroup>
  </Navigation>
);

/*
 * On a narrow screen the top bar has no room for the sections and the
 * component navigation has no column of its own, so both move in here.
 */
const MobileMenu = () => (
  <ModalTrigger>
    <Button aria-label="Menü öffnen">
      <IconMenu />
    </Button>
    <Modal offCanvas showCloseButton>
      <Heading>Menü</Heading>
      <Content>
        <Section>
          <ActionGroup>
            <Button variant="soft" color="secondary">
              <Icon>
                <IconContrastFilled />
              </Icon>
              <Text>Theme wechseln</Text>
            </Button>
          </ActionGroup>
        </Section>
        <Section>
          <Navigation aria-label="Hauptnavigation">
            <GlobalNavigationLinks />
          </Navigation>
        </Section>
        <Section>
          <Heading>Components</Heading>
          <ComponentNavigation />
        </Section>
      </Content>
    </Modal>
  </ModalTrigger>
);
