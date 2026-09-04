import {
  Content,
  Flex,
  Header,
  Heading,
  LayoutCard,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <Flex direction="column" gap="m">
    <LayoutCard>
      <Section>
        <Heading>API-Token</Heading>
        <Text>
          Der eigentliche Seiteninhalt – hier verkürzt. Die
          Hinweiskarte darunter gehört nicht dazu.
        </Text>
      </Section>
    </LayoutCard>

    <LayoutCard>
      <Section>
        <Header>
          <Heading>
            Automatisiere die mittwald API mit n8n
          </Heading>
        </Header>
        <Content>
          <Text>
            Ab sofort kannst du mittwald direkt aus deinen
            n8n-Workflows steuern – zum Beispiel Deployments
            anstoßen oder Ressourcen verwalten. Suche in n8n
            nach „mittwald" und installiere die verifizierte
            Community-Node.
          </Text>
        </Content>
        <Link href="#" target="_blank">
          Zum npm-Paket
        </Link>
      </Section>
    </LayoutCard>
  </Flex>
);
