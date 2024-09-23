import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components/Table";
import { Text } from "@mittwald/flow-react-components/Text";

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
        <Text>Text (Body)</Text>
      </TableCell>
      <TableCell>1 rem</TableCell>
      <TableCell>16 px</TableCell>
      <TableCell>24 lh</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <Text>
          <strong>Text (Body)</strong>
        </Text>
      </TableCell>
      <TableCell>1 rem</TableCell>
      <TableCell>16 px</TableCell>
      <TableCell>24 lh</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <Text>
          <small>Text (Small)</small>
        </Text>
      </TableCell>
      <TableCell>0,875 rem</TableCell>
      <TableCell>14 px</TableCell>
      <TableCell>21 lh / 24 lh</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <Text>
          <small>
            <strong>Text (Small)</strong>
          </small>
        </Text>
      </TableCell>
      <TableCell>0,875 rem</TableCell>
      <TableCell>14 px</TableCell>
      <TableCell>21 lh / 24 lh</TableCell>
    </TableRow>
  </TableBody>
</Table>;
