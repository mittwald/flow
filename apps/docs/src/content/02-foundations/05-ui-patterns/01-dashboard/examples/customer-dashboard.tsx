import {
  AccentBox,
  Breadcrumb,
  Button,
  ColumnLayout,
  Flex,
  Header,
  Heading,
  Icon,
  LayoutCard,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import { IconHeartHandshake } from "@tabler/icons-react";

export default () => {
  return (
    <ColumnLayout l={[1]} m={[1]}>
      <Flex direction="column" gap="xs">
        <Breadcrumb color="light">
          <Link href="#">Organisation</Link>
          <Link href="#">Dashboard</Link>
        </Breadcrumb>
        <Heading color="light" level={1}>
          Dashboard
        </Heading>
      </Flex>
      <ColumnLayout l={[1, 1]} m={[1]}>
        <LayoutCard>
          <Section>
            <Header>
              <Heading>Vertragspartner</Heading>
              <Button
                onPress={() => alert("not implemented")}
                color="secondary"
                variant="soft"
              >
                Bearbeiten
              </Button>
            </Header>
            <Text>
              Mittwald CM Service GmbH & Co.KG
              <br />
              Max Mustermann
              <br />
              Königsberger Straße 4-6, 32339 Espelkamp
              <br />
              mittwald@mittwald.de
              <br />
              +49 1234 5678910
            </Text>
          </Section>
        </LayoutCard>
        <LayoutCard>
          <Section>
            <Header>
              <Heading>Rechnungsempfänger</Heading>
              <Button
                onPress={() => alert("not implemented")}
                color="secondary"
                variant="soft"
              >
                Bearbeiten
              </Button>
            </Header>
            <Text>
              <strong>Rechnung</strong>
            </Text>
            <Text>
              Max Mustermann
              <br />
              Königsberger Straße 4-6, 32339 Espelkamp
              <br />
              mittwald@mittwald.de
              <br />
              +49 1234 5678910
            </Text>
          </Section>
        </LayoutCard>
      </ColumnLayout>
      <LayoutCard>
        <AccentBox>
          <Icon>
            <IconHeartHandshake />
          </Icon>
          <Section>
            <Heading>
              Entwickle deine eigene Extension
            </Heading>
            <Text>
              Du hast Lust als Organisation deine eigene
              Extension zu bauen und sie der Community
              bereitzustellen? Du hast vorab noch Fragen
              rund um die Contribution? Lass uns drüber
              quatschen.
            </Text>
            <Link href="#" target="_blank">
              Contributor werden
            </Link>
          </Section>
        </AccentBox>
      </LayoutCard>
    </ColumnLayout>
  );
};
