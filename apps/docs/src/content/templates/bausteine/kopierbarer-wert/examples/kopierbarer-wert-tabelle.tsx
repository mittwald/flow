import {
  CopyButton,
  Heading,
  LayoutCard,
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
  const rows = [
    {
      protocol: "IMAP",
      host: "mail.mittwald.de",
      port: "993",
    },
    {
      protocol: "POP3",
      host: "mail.mittwald.de",
      port: "995",
    },
    {
      protocol: "SMTP",
      host: "mail.mittwald.de",
      port: "465",
    },
  ];

  return (
    <LayoutCard>
      <Section>
        <Heading>Verbindungsdaten</Heading>
        <Text>
          Drei gleichartige Datensätze nebeneinander – als
          Tabelle übersichtlicher als neun einzelne
          Wertepaare.
        </Text>
        <Table aria-label="Verbindungsdaten">
          <TableHeader>
            <TableColumn>Protokoll</TableColumn>
            <TableColumn>Server</TableColumn>
            <TableColumn>Port</TableColumn>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.protocol}>
                <TableCell rowHeader>
                  {row.protocol}
                </TableCell>
                <TableCell>
                  {row.host}
                  <CopyButton value={row.host} />
                </TableCell>
                <TableCell>
                  {row.port}
                  <CopyButton value={row.port} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </LayoutCard>
  );
};
