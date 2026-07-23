import {
  InlineCode,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components";

<Table
  layout="fixed"
  minWidth={640}
  aria-label="Button Props"
>
  <TableHeader>
    <TableColumn width={160}>Name</TableColumn>
    <TableColumn width="25%">Type</TableColumn>
    <TableColumn>Default</TableColumn>
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
    </TableRow>
    <TableRow>
      <TableCell>
        <InlineCode>variant</InlineCode>
      </TableCell>
      <TableCell>plain | solid | soft</TableCell>
      <TableCell>solid</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <InlineCode>size</InlineCode>
      </TableCell>
      <TableCell>m | s</TableCell>
      <TableCell>m</TableCell>
    </TableRow>
  </TableBody>
</Table>;
