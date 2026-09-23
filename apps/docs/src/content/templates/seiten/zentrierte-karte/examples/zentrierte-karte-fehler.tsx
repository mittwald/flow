import {
  Button,
  Flex,
  Heading,
  IconDanger,
  IllustratedMessage,
  LayoutCard,
  Link,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <Flex direction="column" align="center" gap="l">
    <Flex direction="column" align="center">
      <Heading level={1} size="l" color="dark">
        mittwald.
      </Heading>
      <Text color="dark">mStudio</Text>
    </Flex>

    <div style={{ width: "100%", maxWidth: 520 }}>
      <LayoutCard>
        <IllustratedMessage color="danger">
          <IconDanger />
          <Heading>
            Die Seite konnte nicht geöffnet werden
          </Heading>
          <Text>
            Die aufgerufene Adresse ist ungültig oder
            unvollständig. Bitte prüfe den Link und versuche
            es erneut.
          </Text>
          <Button variant="soft" color="secondary">
            Zur Startseite
          </Button>
        </IllustratedMessage>
      </LayoutCard>
    </div>

    <Flex
      direction="row"
      gap="m"
      wrap="wrap"
      justify="center"
    >
      <Link href="#" target="_blank">
        Datenschutz
      </Link>
      <Link href="#" target="_blank">
        Impressum
      </Link>
    </Flex>
  </Flex>
);
