import {
  IconCheck,
  IconClose,
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
        <IconCheck status="success" aria-label="Zugriff" />
      </TableCell>
      <TableCell horizontalAlign="center">
        <IconClose
          status="danger"
          aria-label="Kein Zugriff"
        />
      </TableCell>
    </TableRow>
  </TableBody>
</Table>;
