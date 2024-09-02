import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components/Table";
import { InlineCode } from "@mittwald/flow-react-components/InlineCode";

<Table>
  <TableHeader>
    <TableColumn></TableColumn>
    <TableColumn>Size REM</TableColumn>
    <TableColumn>Size px</TableColumn>
    <TableColumn>Line Height</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>
        <InlineCode>code</InlineCode>
      </TableCell>
      <TableCell>0,875 rem</TableCell>
      <TableCell>14 px</TableCell>
      <TableCell>24 lh</TableCell>
    </TableRow>
  </TableBody>
</Table>;
