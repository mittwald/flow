import type { Meta, StoryObj } from "@storybook/react";
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
  argTypes: {
    verticalAlign: { control: "inline-radio", options: ["top", "middle"] },
  },
  args: { verticalAlign: "top" },
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

export const WithFooter: Story = {
  render: (props) => (
    <Table {...props} aria-label="Order overview">
      <TableHeader>
        <TableColumn>Article</TableColumn>
        <TableColumn horizontalAlign="end">Price</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Hyperdrive overhaul</TableCell>
          <TableCell horizontalAlign="end">32,00 €</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Deflector shield repair</TableCell>
          <TableCell horizontalAlign="end">Inclusive</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Hull plating replacement</TableCell>
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
          <TableCell rowHeader>Hyperdrive overhaul</TableCell>
          <TableCell>32,00 €</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowHeader>Deflector shield repair</TableCell>
          <TableCell>Inclusive</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowHeader>Hull plating replacement</TableCell>
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
          <TableCell>Death Star plans</TableCell>
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

export const FixedColumnWidths: Story = {
  render: (props) => (
    <Table {...props} layout="fixed" aria-label="Crew assignments">
      <TableHeader>
        <TableColumn width={80}>ID</TableColumn>
        <TableColumn width="40%">Name</TableColumn>
        <TableColumn>Role</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>YT-1300</TableCell>
          <TableCell>Han Solo</TableCell>
          <TableCell>Captain</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>R2</TableCell>
          <TableCell>R2-D2</TableCell>
          <TableCell>Astromech droid</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>TK-421</TableCell>
          <TableCell>Luke Skywalker</TableCell>
          <TableCell>Rescue operation</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
