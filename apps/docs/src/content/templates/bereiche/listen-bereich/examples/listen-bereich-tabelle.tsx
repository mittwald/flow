import {
  ActionGroup,
  Button,
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
  const limits = [
    {
      name: "Ausgehende E-Mails",
      period: "pro Stunde",
      value: "250",
    },
    {
      name: "Ausgehende E-Mails",
      period: "pro Tag",
      value: "1.000",
    },
    {
      name: "Empfänger je E-Mail",
      period: "–",
      value: "50",
    },
  ];

  return (
    <LayoutCard>
      <Section>
        <Heading>Versandlimits</Heading>
        <Text>
          Gleichförmige Wertetupel – Name, Zeitraum, Wert –
          lesen sich als Tabelle besser als als Liste.
        </Text>
        <Table aria-label="Versandlimits">
          <TableHeader>
            <TableColumn>Limit</TableColumn>
            <TableColumn>Zeitraum</TableColumn>
            <TableColumn>Wert</TableColumn>
          </TableHeader>
          <TableBody>
            {limits.map((limit) => (
              <TableRow
                key={`${limit.name}-${limit.period}`}
              >
                <TableCell rowHeader>
                  {limit.name}
                </TableCell>
                <TableCell>{limit.period}</TableCell>
                <TableCell>{limit.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ActionGroup>
          <Button variant="soft" color="secondary">
            Limits anpassen
          </Button>
        </ActionGroup>
      </Section>
    </LayoutCard>
  );
};
