import {
  Bar,
  CartesianChart,
  CodeBlock,
  ColumnLayout,
  DonutChart,
  Heading,
  Section,
  SkeletonMode,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  XAxis,
  YAxis,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Section>
      <Switch
        isSelected={isLoading}
        onChange={setIsLoading}
      >
        Ladezustand anzeigen
      </Switch>
      <SkeletonMode isEnabled={isLoading}>
        <Section>
          <Heading>Webshop Relaunch</Heading>
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
            <DonutChart
              value={70}
              aria-label="Speicherplatz"
            />
          </ColumnLayout>
          <CodeBlock
            code={`server {
  listen 443 ssl;
  server_name webshop.example-domain.de;
}`}
          />
          <Table aria-label="Zertifikate">
            <TableHeader>
              <TableColumn>Domain</TableColumn>
              <TableColumn>Gültig bis</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  webshop.example-domain.de
                </TableCell>
                <TableCell>12.01.2027</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Section>
      </SkeletonMode>
    </Section>
  );
};
