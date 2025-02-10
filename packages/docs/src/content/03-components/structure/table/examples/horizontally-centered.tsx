import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components/Table";
import {
  IconCheck,
  IconClose,
} from "@mittwald/flow-react-components/Icons";

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
        <IconCheck />
      </TableCell>
      <TableCell horizontalAlign="center">
        <IconClose />
      </TableCell>
    </TableRow>
  </TableBody>
</Table>;
