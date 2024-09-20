import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components/Table";
import { Link } from "@mittwald/flow-react-components/Link";

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
        <Link>Link</Link>
      </TableCell>
      <TableCell>0,875 rem</TableCell>
      <TableCell>14 px</TableCell>
      <TableCell>24 lh</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <Link inline>Link</Link>
      </TableCell>
      <TableCell>1 rem</TableCell>
      <TableCell>16 px</TableCell>
      <TableCell>24 lh</TableCell>
    </TableRow>
  </TableBody>
</Table>;
