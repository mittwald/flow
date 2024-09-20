import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components/Table";
import { Label } from "@mittwald/flow-react-components/Label";

<Table>
  <TableHeader>
    <TableColumn />
    <TableColumn>Size REM</TableColumn>
    <TableColumn>Size PX</TableColumn>
    <TableColumn>Line Height</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>
        <Label>Label</Label>
      </TableCell>
      <TableCell>0,875 rem</TableCell>
      <TableCell>14 px</TableCell>
      <TableCell>21 lh / 24 lh</TableCell>
    </TableRow>
  </TableBody>
</Table>;
