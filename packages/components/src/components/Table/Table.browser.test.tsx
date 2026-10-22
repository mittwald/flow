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
