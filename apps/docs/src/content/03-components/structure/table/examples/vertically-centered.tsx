import {
  InlineCode,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components";

<Table aria-label="Button Props" verticalAlign="middle">
  <TableHeader>
    <TableColumn>Name</TableColumn>
    <TableColumn>Type</TableColumn>
    <TableColumn>Default</TableColumn>
    <TableColumn>Description</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>
        <InlineCode>size</InlineCode>
      </TableCell>
      <TableCell>m | s</TableCell>
      <TableCell>m</TableCell>
      <TableCell>
        Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Cumque eius quam quas vel voluptas, ullam
        aliquid fugit.
      </TableCell>
    </TableRow>
  </TableBody>
</Table>;
