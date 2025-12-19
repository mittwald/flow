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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
                eius quam quas vel voluptas, ullam aliquid fugit. Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Cumque eius quam
                quas vel voluptas, ullam aliquid fugit.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>TableCell</TableCell>
              <TableCell>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
                eius quam quas vel voluptas, ullam aliquid fugit. Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Cumque eius quam
                quas vel voluptas, ullam aliquid fugit.
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
