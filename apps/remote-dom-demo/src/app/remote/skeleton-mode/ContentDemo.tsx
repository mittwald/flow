"use client";
import {
  Bar,
  CartesianChart,
  CodeBlock,
  CodeEditor,
  ColumnLayout,
  DonutChart,
  Flex,
  Kbd,
  Label,
  Markdown,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Text,
  XAxis,
  YAxis,
} from "@mittwald/flow-remote-react-components";

const nginxConfig = `server {
  listen 443 ssl;
  server_name webshop.example-domain.de;
}`;

export const ContentDemo = () => (
  <>
    <Flex gap="m" align="center">
      <Text>Suche öffnen mit</Text>
      <Kbd keys={["mod", "k"]} variant="soft" />
    </Flex>
    <Markdown>
      {
        "Stelle vor dem Umzug den **Nameserver** um.\n\n- Zone exportieren\n- Zone importieren"
      }
    </Markdown>
    <CodeBlock code={nginxConfig} />
    <ColumnLayout m={[2, 1]}>
      <CartesianChart
        height="160px"
        data={[
          { month: "Juli", requests: 1200 },
          { month: "August", requests: 1800 },
        ]}
      >
        <XAxis dataKey="month" />
        <YAxis />
        <Bar dataKey="requests" />
      </CartesianChart>
      <DonutChart value={70} aria-label="Speicherplatz" />
    </ColumnLayout>
    <CodeEditor value={nginxConfig}>
      <Label>Konfiguration</Label>
    </CodeEditor>
    <Table aria-label="Zertifikate">
      <TableHeader>
        <TableColumn>Domain</TableColumn>
        <TableColumn>Gültig bis</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>webshop.example-domain.de</TableCell>
          <TableCell>12.01.2027</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </>
);

export default ContentDemo;
