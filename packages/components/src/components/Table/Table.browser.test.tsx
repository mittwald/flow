import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test } from "vitest";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Button } from "@/components/Button";

test("arrow keys move between a row header and the cells of its row", async () => {
  await render(
    <Table aria-label="Connection">
      <TableHeader>
        <TableColumn>Property</TableColumn>
        <TableColumn>Value</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell rowHeader>Host</TableCell>
          <TableCell>
            <Button>Copy</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );

  const button = page.getByRole("button", { name: "Copy" });
  const rowHeader = page.getByRole("rowheader", { name: "Host" });
  const row = page.getByRole("row", { name: "Host" });

  await button.click();
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(rowHeader).toHaveFocus();

  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(row).toHaveFocus();

  await userEvent.keyboard("{ArrowRight}{ArrowRight}");
  await expect.element(button).toHaveFocus();
});

test("only the first column holds row headers by default", async () => {
  await render(
    <Table aria-label="Domains">
      <TableHeader>
        <TableColumn>Domain</TableColumn>
        <TableColumn>Status</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>example.com</TableCell>
          <TableCell>active</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );

  await expect
    .element(page.getByRole("rowheader", { name: "example.com" }))
    .toBeInTheDocument();
  await expect
    .element(page.getByRole("gridcell", { name: "active" }))
    .toBeInTheDocument();
});

test("isRowHeader moves the row headers to another column", async () => {
  await render(
    <Table aria-label="Domains">
      <TableHeader>
        <TableColumn isRowHeader={false}>Status</TableColumn>
        <TableColumn isRowHeader>Domain</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>active</TableCell>
          <TableCell>example.com</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );

  await expect
    .element(page.getByRole("rowheader", { name: "example.com" }))
    .toBeInTheDocument();
  await expect
    .element(page.getByRole("gridcell", { name: "active" }))
    .toBeInTheDocument();
});

/*
 * A parent re-render must not remount the rows: a long table pays for every
 * row it rebuilds.
 */
test("a re-render keeps the rows and cells", async () => {
  const domains = ["example.com", "example.org", "example.net"];
  const DomainTable = () => (
    <Table aria-label="Domains">
      <TableHeader>
        <TableColumn>Domain</TableColumn>
        <TableColumn>Status</TableColumn>
      </TableHeader>
      <TableBody>
        {domains.map((domain) => (
          <TableRow key={domain}>
            <TableCell>{domain}</TableCell>
            <TableCell>active</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  const screen = await render(<DomainTable />);
  const rows = () => page.getByRole("row").elements();
  const cells = () => page.getByRole("gridcell").elements();
  const rowsBefore = rows();
  const cellsBefore = cells();
  expect(rowsBefore).toHaveLength(4);

  await screen.rerender(<DomainTable />);

  rows().forEach((row, i) => expect(row).toBe(rowsBefore[i]));
  cells().forEach((cell, i) => expect(cell).toBe(cellsBefore[i]));
});
