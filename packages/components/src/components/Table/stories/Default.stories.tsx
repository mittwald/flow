import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/Table";
import { InlineCode } from "@/components/InlineCode";

const meta: Meta<typeof Table> = {
  title: "Structure/Table",
  component: Table,
  render: (props) => (
    <Table aria-label="Files" selectionMode="multiple" {...props}>
      <TableHeader>
        <TableColumn isRowHeader>Name</TableColumn>
        <TableColumn isRowHeader>Type</TableColumn>
        <TableColumn isRowHeader>Default</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <InlineCode>color</InlineCode>
          </TableCell>
          <TableCell>"primary" | "accent" | "secondary" | "danger"</TableCell>
          <TableCell>"primary"</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <InlineCode>variant</InlineCode>
          </TableCell>
          <TableCell>"plain" | "solid" | "soft"</TableCell>
          <TableCell>"solid"</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <InlineCode>size</InlineCode>
          </TableCell>
          <TableCell>"m" | "s"</TableCell>
          <TableCell>"m"</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {};
