import Table, {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components/Table";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Text } from "@mittwald/flow-react-components/Text";
import { Label } from "@mittwald/flow-react-components/Label";

<Table>
  <TableHeader>
    <TableColumn></TableColumn>
    <TableColumn>Size REM</TableColumn>
    <TableColumn>Size PX</TableColumn>
    <TableColumn>Line Height</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>
        <Heading level={1}>Heading 1</Heading>
      </TableCell>
      <TableCell>2 rem</TableCell>
      <TableCell>32 px</TableCell>
      <TableCell>48 lh</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <Heading level={2}>Heading 2</Heading>
      </TableCell>
      <TableCell>1,5 rem</TableCell>
      <TableCell>24 px</TableCell>
      <TableCell>36 lh</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <Heading level={2}>Heading 3</Heading>
      </TableCell>
      <TableCell>1,25 rem</TableCell>
      <TableCell>20 px</TableCell>
      <TableCell>30 lh</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <Heading level={4}>Heading 4</Heading>
      </TableCell>
      <TableCell>1,125 rem</TableCell>
      <TableCell>18 px</TableCell>
      <TableCell>27 lh</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <Heading level={5}>Heading 5</Heading>
      </TableCell>
      <TableCell>1 rem</TableCell>
      <TableCell>16 px</TableCell>
      <TableCell>24 lh</TableCell>
    </TableRow>
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
