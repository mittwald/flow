import {
  InlineCode,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components";

<Table aria-label="Button Props">
  <TableHeader>
    <TableColumn>Name</TableColumn>
    <TableColumn>Type</TableColumn>
    <TableColumn>Default</TableColumn>
    <TableColumn>Description</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>
        <InlineCode>color</InlineCode>
      </TableCell>
      <TableCell>
        primary | accent | secondary | danger
      </TableCell>
      <TableCell>primary</TableCell>
      <TableCell>The color of the button</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <InlineCode>variant</InlineCode>
      </TableCell>
      <TableCell>plain | solid | soft</TableCell>
      <TableCell>solid</TableCell>
      <TableCell>The variant of the button</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <InlineCode>size</InlineCode>
      </TableCell>
      <TableCell>m | s</TableCell>
      <TableCell>m</TableCell>
      <TableCell>The size of the button</TableCell>
    </TableRow>
  </TableBody>
</Table>;
