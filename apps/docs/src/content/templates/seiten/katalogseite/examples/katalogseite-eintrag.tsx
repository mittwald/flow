import {
  ActionGroup,
  Avatar,
  Button,
  ColumnLayout,
  Content,
  Flex,
  Header,
  Heading,
  IconApp,
  InlineCode,
  LayoutCard,
  Link,
  Section,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Text,
} from "@mittwald/flow-react-components";

export default () => {
  const meta = [
    { key: "Version", value: "latest" },
    { key: "Entwickler", value: "n8n GmbH" },
    { key: "Lizenz", value: "Sustainable Use License" },
    { key: "Repository", value: "github.com" },
  ];

  return (
    <Flex direction="column" gap="m">
      <Heading level={1} color="dark">
        Vorlage
      </Heading>

      <LayoutCard>
        <Section>
          <Header>
            <Flex direction="row" gap="s" align="center">
              <Avatar color="violet">
                <IconApp />
              </Avatar>
              <Flex direction="column">
                <Heading>n8n</Heading>
                <Text>
                  Automatisierung für deine
                  Geschäftsprozesse
                </Text>
              </Flex>
            </Flex>
            <ActionGroup>
              <Button>Installieren</Button>
            </ActionGroup>
          </Header>
        </Section>
      </LayoutCard>

      <LayoutCard>
        <ColumnLayout l={[2, 1]} m={[1]}>
          <Section>
            <Text>
              n8n ist eine erweiterbare
              Workflow-Automatisierungsplattform und
              self-hosted Alternative zu Cloud-Diensten. Sie
              verbindet Anwendungen, APIs und interne
              Systeme über einen visuellen Workflow-Editor
              und automatisiert wiederkehrende Prozesse ohne
              tiefgreifende Programmierkenntnisse.
            </Text>
            <Text>
              Bei mittwald läuft n8n als self-hosted
              Container in deutschen Rechenzentren. Die
              Datenbank wird über das mittwald Backup-Label{" "}
              <InlineCode>backup.command</InlineCode>{" "}
              gesichert.
            </Text>
          </Section>

          <Section>
            <Table aria-label="Angaben zur Vorlage">
              <TableHeader>
                <TableColumn>Angabe</TableColumn>
                <TableColumn>Wert</TableColumn>
              </TableHeader>
              <TableBody>
                {meta.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell rowHeader>
                      {row.key}
                    </TableCell>
                    <TableCell>
                      <Link href="#" target="_blank">
                        {row.value}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>
        </ColumnLayout>
      </LayoutCard>
    </Flex>
  );
};
