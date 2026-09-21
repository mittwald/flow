import {
  Badge,
  Button,
  Flex,
  Heading,
  HeaderNavigation,
  Icon,
  IconSearch,
  Label,
  LayoutCard,
  Link,
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
        <Link href="#">Get Started</Link>
        <Link href="#">Foundations</Link>
        <Link href="#">Templates</Link>
        <Link href="#" aria-current="page">
          Components
        </Link>
        <Button aria-label="Suche">
          <IconSearch />
        </Button>
        <Button aria-label="Theme wechseln">
          <Icon>
            <IconContrastFilled />
          </Icon>
        </Button>
      </HeaderNavigation>
    </Flex>

    <Flex
      gap="l"
      wrap="wrap"
      align="stretch"
      className={styles.body}
    >
      <LayoutCard className={styles.sidebar}>
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
            <Link
              href="#"
              aria-current="page"
              className={styles.tocLink}
            >
              Button
            </Link>
            <Link href="#" className={styles.tocLink}>
              Colors
            </Link>
            <Link
              href="#"
              className={`${styles.tocLink} ${styles.tocSub}`}
            >
              Light und Dark
            </Link>
            <Link href="#" className={styles.tocLink}>
              Sizes
            </Link>
            <Link href="#" className={styles.tocLink}>
              Variants
            </Link>
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
