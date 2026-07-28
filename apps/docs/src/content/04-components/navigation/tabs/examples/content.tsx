import {
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  TabTitle,
} from "@mittwald/flow-react-components";

<Tabs>
  <Tab>
    <TabTitle>Mit App verbinden</TabTitle>
    <Table>
      <TableHeader>
        <TableColumn />
        <TableColumn />
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell rowHeader>Benutzername</TableCell>
          <TableCell>ssh-app@example</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowHeader>URL</TableCell>
          <TableCell>ssh-app@example@ssh.host</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Tab>
  <Tab>
    <TabTitle>Mit Container verbinden</TabTitle>
    <Table>
      <TableHeader>
        <TableColumn />
        <TableColumn />
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell rowHeader>Benutzername</TableCell>
          <TableCell>ssh-container@example</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowHeader>URL</TableCell>
          <TableCell>
            ssh-container@example@ssh.host
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Tab>
</Tabs>;
