import {
  IconCheck,
  IconX,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components";

<Table aria-label="Scopes">
  <TableHeader>
    <TableColumn>Bereich</TableColumn>
    <TableColumn horizontalAlign="center">
      Lesen
    </TableColumn>
    <TableColumn horizontalAlign="center">
      Schreiben
    </TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Projekt</TableCell>
      <TableCell horizontalAlign="center">
        <IconCheck aria-label="Zugriff" />
      </TableCell>
      <TableCell horizontalAlign="center">
        <IconX aria-label="Kein Zugriff" />
      </TableCell>
    </TableRow>
  </TableBody>
</Table>;
