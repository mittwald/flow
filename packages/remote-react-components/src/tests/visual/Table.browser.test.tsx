import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "Table (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Table,
      TableHeader,
      TableCell,
      TableColumn,
      TableBody,
      TableRow,
      IconCheck,
      IconClose,
      Flex,
      TableFooterRow,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Table aria-label="Table">
          <TableHeader>
            <TableColumn>Column</TableColumn>
            <TableColumn horizontalAlign="center">Column</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>TableCell</TableCell>
              <TableCell horizontalAlign="center">
                <IconCheck status="success" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>TableCell</TableCell>
              <TableCell horizontalAlign="center">
                <IconClose status="danger" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table aria-label="Table" verticalAlign="middle">
          <TableHeader>
            <TableColumn>Column</TableColumn>
            <TableColumn>Column</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>TableCell</TableCell>
              <TableCell>
                A long time ago in a galaxy far, far away, the Rebel Alliance
                struck a blow against the Galactic Empire. Rebel spies stole
                secret plans to the Death Star, the Empire's ultimate weapon,
                from the fortress world of Scarif.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>TableCell</TableCell>
              <TableCell>
                A long time ago in a galaxy far, far away, the Rebel Alliance
                struck a blow against the Galactic Empire. Rebel spies stole
                secret plans to the Death Star, the Empire's ultimate weapon,
                from the fortress world of Scarif.
              </TableCell>
            </TableRow>
            <TableFooterRow>
              <TableCell colSpan={2}>Footer</TableCell>
            </TableFooterRow>
          </TableBody>
        </Table>
        <Table aria-label="Table">
          <TableHeader>
            <TableColumn />
            <TableColumn />
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell rowHeader>RowHeader</TableCell>
              <TableCell>TableCell</TableCell>
            </TableRow>
            <TableRow>
              <TableCell rowHeader>RowHeader</TableCell>
              <TableCell>TableCell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Flex>,
    );

    await testScreenshot("Table");
  },
);

test.each(testEnvironments)(
  "Table Column Widths (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Table,
      TableHeader,
      TableColumn,
      TableBody,
      TableRow,
      TableCell,
      Flex,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Table aria-label="Fixed layout" layout="fixed">
          <TableHeader>
            <TableColumn width={80}>ID</TableColumn>
            <TableColumn width="40%">Name</TableColumn>
            <TableColumn>Description</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1024</TableCell>
              <TableCell>
                A very long name that clearly exceeds the fixed column width and
                therefore wraps onto several lines instead of widening the
                column
              </TableCell>
              <TableCell>
                Columns without a fixed width share the remaining space.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>1025</TableCell>
              <TableCell>Short</TableCell>
              <TableCell>Another description.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table aria-label="Minimum column width">
          <TableHeader>
            <TableColumn minWidth={240}>Status</TableColumn>
            <TableColumn>Note</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>OK</TableCell>
              <TableCell>
                The status column keeps its minimum width even with short
                content.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Flex>,
    );

    await testScreenshot("Table Column Widths");
  },
);

test.each(testEnvironments)(
  "Table Minimum Width (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Table,
      TableHeader,
      TableColumn,
      TableBody,
      TableRow,
      TableCell,
    },
  }) => {
    await render(
      <Table aria-label="Minimum table width" layout="fixed" minWidth={1400}>
        <TableHeader>
          <TableColumn>Column one</TableColumn>
          <TableColumn>Column two</TableColumn>
          <TableColumn>Column three</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              The table keeps its minimum width and overflows its container.
            </TableCell>
            <TableCell>The container scrolls horizontally.</TableCell>
            <TableCell>Columns are not squeezed.</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    await testScreenshot("Table Minimum Width");
  },
);
