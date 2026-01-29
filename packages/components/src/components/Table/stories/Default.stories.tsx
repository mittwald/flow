import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { InlineCode } from "@/components/InlineCode";
import { dummyText } from "@/lib/dev/dummyText";
import { TableFooterRow } from "@/components/Table/components/TableFooterRow";
import { IconCheck, IconClose } from "@/components/Icon/components/icons";

const meta: Meta<typeof Table> = {
  title: "Structure/Table",
  component: Table,
  render: (props) => (
    <Table aria-label="Button Props" {...props}>
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
          <TableCell>primary | accent | secondary | danger</TableCell>
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
          <TableCell>{dummyText.long}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {};

export const VerticallyCenteredRows: Story = {
  args: { verticalAlign: "middle" },
};

export const WithFooter: Story = {
  render: (props) => (
    <Table {...props} aria-label="Order overview">
      <TableHeader>
        <TableColumn>Article</TableColumn>
        <TableColumn horizontalAlign="end">Price</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Webhosting (2 vCPU / 4 GB RAM)</TableCell>
          <TableCell horizontalAlign="end">32,00 €</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>20 GB storage</TableCell>
          <TableCell horizontalAlign="end">Inclusive</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>20 GB additional storage</TableCell>
          <TableCell horizontalAlign="end">2,00 €</TableCell>
        </TableRow>
        <TableFooterRow>
          <TableCell>total</TableCell>
          <TableCell horizontalAlign="end">34,00 €</TableCell>
        </TableFooterRow>
      </TableBody>
    </Table>
  ),
};

export const WithRowHeader: Story = {
  render: (props) => (
    <Table {...props} aria-label="Order overview">
      <TableHeader>
        <TableColumn />
        <TableColumn />
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell rowHeader>Webhosting (2 vCPU / 4 GB RAM)</TableCell>
          <TableCell>32,00 €</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowHeader>20 GB storage</TableCell>
          <TableCell>Inclusive</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowHeader>20 GB additional storage</TableCell>
          <TableCell>2,00 €</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const HorizontallyCenteredColumns: Story = {
  render: (props) => (
    <Table {...props} aria-label="Scopes">
      <TableHeader>
        <TableColumn>Bereich</TableColumn>
        <TableColumn horizontalAlign="center">Lesen</TableColumn>
        <TableColumn horizontalAlign="center">Schreiben</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Projekt</TableCell>
          <TableCell horizontalAlign="center">
            <IconCheck status="success" />
          </TableCell>
          <TableCell horizontalAlign="center">
            <IconClose status="danger" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
